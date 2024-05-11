import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSort, faTrash } from '@fortawesome/free-solid-svg-icons';
import { db } from '../Firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import mixpanel from 'mixpanel-browser'; // Import Mixpanel

const NotificationFrame = ({ data, onPress, onSelect, selected, onDelete }) => {
  const getDisplayText = () => {
    if (data.type === 'agreement') {
      return `${data.name || 'Agreement'} - ${data.date}`;
    } else if (data.type === 'invoice') {
      return `Invoice for ${data.customer || 'Customer'} - Due: ${data.due_date}`;
    }
  };

  const getAmount = () => {
    return data.type === 'agreement' ? `$${data.amount}` : `Price: $${data.price}`;
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: '95%',
        borderRadius: 12,
        backgroundColor: 'white',
        marginBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        borderColor: 'gray',
        borderRadius: 10,
      }}
      onPress={() => {
        mixpanel.track('Notification Clicked', { 'Notification Type': data.type }); // Add Mixpanel event
        onPress();
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => onSelect(data.id)}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.31)',
              backgroundColor: selected ? 'blue' : 'white',
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={{ color: 'black', fontSize: 15, fontWeight: '500' }}>
            {getDisplayText()}
          </Text>
          <Text style={{ color: 'black', fontSize: 12, lineHeight: 14.28 }}>
            {getAmount()}
          </Text>
        </View>
      </View>
      {selected && (
        <TouchableOpacity onPress={() => onDelete(data.id)} style={{ paddingRight: 10 }}>
          <FontAwesomeIcon icon={faTrash} size={20} color="lightgray" onMouseOver={(e) => e.target.style.color = 'red'} onMouseOut={(e) => e.target.style.color = 'lightgray'} />
        </TouchableOpacity>
      )}
      <FontAwesomeIcon icon={faArrowRight} size={20} color="black" />
    </TouchableOpacity>
  );
};

const BottomHalf = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const screenWidth = Dimensions.get('window').width;
  const currentDate = new Date();
  const scrollViewWidth = screenWidth * 0.8;
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions(Dimensions.get('window'));
    };

    Dimensions.addEventListener('change', updateDimensions);
    fetchNotifications();

    return () => {
      Dimensions.removeEventListener('change', updateDimensions);
    };
  }, []);

  const fetchNotifications = async (sortOption = 'date') => {
    try {
      const agreementsQuery = query(collection(db, 'agreements'), where('userId', '==', currentUser.uid));
      const agreementsSnapshot = await getDocs(agreementsQuery);
      const agreements = agreementsSnapshot.docs.map(doc => ({ id: doc.id, type: 'agreement', ...doc.data() }));

      const invoicesQuery = query(collection(db, 'invoices'), where('userId', '==', currentUser.uid));
      const invoicesSnapshot = await getDocs(invoicesQuery);
      const invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, type: 'invoice', ...doc.data() }));

      let combinedData = [...agreements, ...invoices];

      if (sortOption === 'date') {
        combinedData.sort((a, b) => {
          const dateA = new Date(a.dueDate || a.date);
          const dateB = new Date(b.dueDate || b.date);
          return dateA - dateB;
        });
      } else if (sortOption === 'type') {
        combinedData.sort((a, b) => a.type.localeCompare(b.type));
      } else if (sortOption === 'amount') {
        combinedData.sort((a, b) => (a.amount || a.price) - (b.amount || b.price));
      }

      setNotifications(combinedData);
    } catch (error) {
      console.error("Error fetching notifications: ", error);
    }
  };

  const navigateToDetailPage = (notification) => {
    mixpanel.track('Navigate to Detail Page', { 'Notification Type': notification.type }); // Add Mixpanel event
    if (notification.type === 'agreement') {
      navigate(`/share-agreement/${notification.id}`);
    } else if (notification.type === 'invoice') {
      navigate(`/preview-invoice/${notification.id}`);
    }
  };

  const handleSelectNotification = (id) => {
    mixpanel.track('Notification Selected', { 'Notification ID': id }); // Add Mixpanel event
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(notificationId => notificationId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const notification = notifications.find(notification => notification.id === id);
      if (notification) {
        await deleteDoc(doc(db, notification.type + 's', id));
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  const handleMassDelete = async () => {
    try {
      for (const id of selectedNotifications) {
        const notification = notifications.find(notification => notification.id === id);
        if (notification) {
          await deleteDoc(doc(db, notification.type + 's', id));
        }
      }
      fetchNotifications();
      setSelectedNotifications([]);
    } catch (error) {
      console.error("Error in mass deletion: ", error);
    }
  };

  return (
    <View style={{...styles.subFrameContainer, height: dimensions.height * 1, width: dimensions.width * 0.8, padding: 20}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => {
          setSortModalVisible(!sortModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.buttonClose, { position: 'absolute', top: 10, right: 10, backgroundColor: 'transparent' }]}
              onPress={() => {
                setSortModalVisible(!sortModalVisible);
              }}
            >
              <Text style={styles.textStyleClose}>X</Text> {/* Use textStyleClose for the X button */}
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSort]}
              onPress={() => {
                mixpanel.track('Sort Notifications', { 'Sort Option': 'date' }); // Add Mixpanel event
                fetchNotifications('date');
                setSortModalVisible(!sortModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Sort by Date</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSort]}
              onPress={() => {
                mixpanel.track('Sort Notifications', { 'Sort Option': 'type' }); // Add Mixpanel event
                fetchNotifications('type');
                setSortModalVisible(!sortModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Sort by Type</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSort]}
              onPress={() => {
                mixpanel.track('Sort Notifications', { 'Sort Option': 'amount' }); // Add Mixpanel event
                fetchNotifications('amount');
                setSortModalVisible(!sortModalVisible);
              }}
            >
              <Text style={styles.textStyle}>Sort by Amount</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.subFrameText}>
        <Text style={styles.subFrameTextTypographyOne}>Recents</Text>
        <TouchableOpacity onPress={() => setSortModalVisible(true)}>
          <FontAwesomeIcon icon={faSort} size={20} color="black" />
        </TouchableOpacity>
        {selectedNotifications.length > 0 && (
          <TouchableOpacity onPress={handleMassDelete}>
            <Text style={styles.subFrameTextTypographyTwo}>Delete Selected</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigate('/invoices')}>
          <Text style={styles.subFrameTextTypographyTwo}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        style={{ width: scrollViewWidth }}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationFrame 
              key={index} 
              data={notification} 
              onPress={() => navigateToDetailPage(notification)} 
              onSelect={handleSelectNotification}
              selected={selectedNotifications.includes(notification.id)}
              onDelete={handleDeleteNotification}
            />
          ))
        ) : (
          <Text style={styles.noNotificationsText}>No current activities to show</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  subFrameContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 40,
    marginTop: '4%',
    padding: 10, // This is the existing padding
    paddingBottom: 20, // Add padding to the bottom
    paddingLeft: 20, // Add padding to the left
    paddingRight: 20, // Add padding to the right
    paddingTop: 20, // Add padding to the top
  },
  contentContainer: {
    // Styles for the content inside the ScrollView
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f5f5',
    borderRadius: 12,
  },
  subFrameText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 53,
    flex: 0,
    lineHeight: '20',
  },
  subFrameTextTypographyOne: {
    color: '#000',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '20',
  },
  subFrameTextTypographyTwo: {
    color: '#000',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '20',
  },
  notificationsFrame: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f8f5f5',
    borderRadius: 12,
    left: 0,
    right: 0,
  },
  noNotificationsText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    borderWidth: .10,
    borderColor: '#000',
    position: 'relative', // Add position relative to modalView
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonSort: {
    backgroundColor: 'black', // Change background color to black
  },
  textStyle: {
    color: 'white', // Change text color to white
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyleClose: {
    color: 'black', // Change text color to black for the X button
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BottomHalf;