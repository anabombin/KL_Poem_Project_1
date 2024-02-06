!(function () {
  function findSegmentIntegrations(segmentApiKey) {
    return window
      .fetch(
        "https://cdn.segment.com/v1/projects/" + segmentApiKey + "/integrations"
      )
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (segmentIntegrations) {
        var OTActiveGroups = window.OnetrustActiveGroups
          ? window.OnetrustActiveGroups.split(",")
          : [];
        return getIntegrations(OTActiveGroups, segmentIntegrations);
      });
  }

  function getIntegrations(OTActiveGroups, segmentIntegrations) {
    var destinationMap = {};
    var mappings = window.SothebysShared.OTMappings;
    segmentIntegrations.forEach((integration) => {
      var key = getObjectKey(mappings, integration.category);
      if (key) {
        destinationMap[integration.creationName] = OTActiveGroups.includes(key);
      }
    });

    return destinationMap;
  }

  function getObjectKey(obj, value) {
    return Object.keys(obj).find((key) => obj[key].includes(value));
  }

  var SothebysShared = {
    OTMappings: {
      C0001: [
        "A/B Testing",
        "Tag Managers",
        "SMS & Push Notifications",
        "Other",
      ],
      C0002: ["Analytics", "Performance Monitoring", "CRM"],
      C0003: ["Personalization"],
      C0004: ["Advertising", "Email Marketing"],
    },
    findSegmentIntegrations: findSegmentIntegrations,
  };

  window.SothebysShared = SothebysShared;
})();