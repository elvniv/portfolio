module.exports = {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify")
      }
    }
  };

module.exports = {
resolve: {
    fallback: {
    "path": require.resolve("path-browserify")
    }
}
};

resolve: {
fallback: {
    "crypto": require.resolve("crypto-browserify"),
    "path": require.resolve("path-browserify")
}
}