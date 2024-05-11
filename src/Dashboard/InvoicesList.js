import React from 'react'
import { View, Text } from 'react-native-web'
import NavigationBar from '../NavigationBar'
import BottomHalf from './BottomHalf'

// This is the page that will be used to display all the invoices


export default function InvoicesList() {
  return (
    <View>
        <NavigationBar />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <BottomHalf />
        </View>
        
    </View> 
  )
}
