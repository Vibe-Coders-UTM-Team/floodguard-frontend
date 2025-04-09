/**
 * This file provides mock implementations of the API endpoints
 * for testing purposes when the actual backend is not available.
 */

// Mock alerts data
const mockAlerts = [
  {
    id: 'alert-001',
    userId: 'system',
    title: 'Flash Flood Warning',
    description: 'Heavy rainfall has caused flash flooding in low-lying areas. Residents are advised to move to higher ground immediately.',
    severity: 'critical',
    type: 'flood',
    actions: 'Move to higher ground. Avoid walking or driving through flood waters. Follow evacuation orders if issued.',
    location: 'Kuala Lumpur City Center',
    latitude: 3.1390,
    longitude: 101.6869,
    isActive: true,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'alert-002',
    userId: 'system',
    title: 'Road Closure Alert',
    description: 'Several major roads are closed due to flooding. Avoid travel in affected areas.',
    severity: 'severe',
    type: 'road_closure',
    actions: 'Use alternative routes. Check local traffic updates before traveling. Stay home if possible.',
    location: 'Petaling Jaya',
    latitude: 3.1073,
    longitude: 101.6068,
    isActive: true,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'alert-003',
    userId: 'system',
    title: 'Evacuation Order',
    description: 'Mandatory evacuation order for residents in Ampang Jaya due to rising water levels.',
    severity: 'critical',
    type: 'evacuation_order',
    actions: 'Evacuate immediately to designated shelters. Bring essential items only. Register at evacuation centers.',
    location: 'Ampang Jaya',
    latitude: 3.1488,
    longitude: 101.7614,
    isActive: true,
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'alert-004',
    userId: 'system',
    title: 'Weather Warning',
    description: 'Heavy rainfall expected to continue for the next 24 hours. Potential for more flooding.',
    severity: 'moderate',
    type: 'weather_warning',
    actions: 'Prepare emergency supplies. Charge devices. Monitor official channels for updates.',
    location: 'Selangor State',
    latitude: 3.0738,
    longitude: 101.5183,
    isActive: true,
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    createdAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 'alert-005',
    userId: 'system',
    title: 'Landslide Risk',
    description: 'Increased risk of landslides in hilly areas due to saturated soil from continuous rain.',
    severity: 'severe',
    type: 'landslide',
    actions: 'Evacuate if in high-risk areas. Watch for signs of land movement. Report cracks or unusual sounds.',
    location: 'Bukit Antarabangsa',
    latitude: 3.1879,
    longitude: 101.7644,
    isActive: true,
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    createdAt: new Date(Date.now() - 14400000).toISOString()
  }
];

// Mock AI reports data
const mockAIReports = [
  {
    id: 'report-001',
    userId: 'system',
    title: 'Flood Risk Analysis: Klang Valley',
    analysis: 'Based on current rainfall patterns, river levels, and terrain analysis, there is a high risk of flooding in the Klang Valley region over the next 48 hours.',
    riskLevel: 'high',
    predictedImpact: 'Potential flooding of low-lying areas, disruption to transportation networks, and possible damage to infrastructure. Approximately 15,000 residents may be affected.',
    recommendedActions: 'Local authorities should prepare evacuation centers, deploy emergency response teams, and issue early warnings to residents in flood-prone areas. Residents should prepare emergency kits and follow official guidance.',
    expectedDuration: '48-72 hours',
    location: 'Klang Valley',
    latitude: 3.0738,
    longitude: 101.5183,
    confidenceScore: 85,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'report-002',
    userId: 'system',
    title: 'Flood Risk Analysis: Johor Bahru',
    analysis: 'Analysis of weather patterns and drainage systems indicates moderate risk of urban flooding in Johor Bahru, particularly in areas with poor drainage infrastructure.',
    riskLevel: 'moderate',
    predictedImpact: 'Localized flooding in urban areas, temporary road closures, and minor disruptions to daily activities. Approximately 5,000 residents may experience some impact.',
    recommendedActions: 'Municipal authorities should clear drainage systems and prepare for water pumping operations. Residents should avoid flood-prone areas and prepare for possible disruptions.',
    expectedDuration: '24-36 hours',
    location: 'Johor Bahru',
    latitude: 1.4927,
    longitude: 103.7414,
    confidenceScore: 78,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'report-003',
    userId: 'system',
    title: 'Flood Risk Analysis: Penang Island',
    analysis: 'Combination of high tides and heavy rainfall creates extreme flood risk for coastal areas of Penang Island. Storm surge potential is significant.',
    riskLevel: 'extreme',
    predictedImpact: 'Severe flooding of coastal areas, potential damage to buildings and infrastructure, and significant disruption to transportation and essential services. Up to 20,000 residents may need to evacuate.',
    recommendedActions: 'Immediate evacuation of low-lying coastal areas. Deployment of emergency response teams and resources. Establishment of emergency shelters inland.',
    expectedDuration: '72-96 hours',
    location: 'Penang Island',
    latitude: 5.4141,
    longitude: 100.3288,
    confidenceScore: 92,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'report-004',
    userId: 'system',
    title: 'Flood Risk Analysis: Kota Kinabalu',
    analysis: 'Current weather conditions and river levels suggest low risk of significant flooding in Kota Kinabalu, though isolated incidents may occur in known flood-prone areas.',
    riskLevel: 'low',
    predictedImpact: 'Minor localized flooding possible in known problem areas. Limited impact on infrastructure and daily activities expected.',
    recommendedActions: 'Standard monitoring of weather conditions and river levels. No special measures required beyond normal preparedness.',
    expectedDuration: '12-24 hours',
    location: 'Kota Kinabalu',
    latitude: 5.9804,
    longitude: 116.0735,
    confidenceScore: 65,
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 'report-005',
    userId: 'system',
    title: 'Flood Risk Analysis: Kuching',
    analysis: 'Heavy rainfall upstream of major rivers combined with high tide conditions creates high flood risk for Kuching and surrounding areas.',
    riskLevel: 'high',
    predictedImpact: 'Significant flooding along riverbanks, potential isolation of some communities, and disruption to transportation and essential services. Approximately 10,000 residents may be affected.',
    recommendedActions: 'Evacuation of flood-prone areas along rivers. Preparation of emergency shelters and supplies. Deployment of rescue teams to potential hotspots.',
    expectedDuration: '48-60 hours',
    location: 'Kuching',
    latitude: 1.5497,
    longitude: 110.3626,
    confidenceScore: 88,
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    createdAt: new Date(Date.now() - 345600000).toISOString()
  }
];

/**
 * Mock implementation of the getAllAlerts API endpoint
 * @returns {Promise<Array>} Array of alert objects
 */
export const mockGetAllAlerts = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockAlerts];
};

/**
 * Mock implementation of the getUserAlerts API endpoint
 * @param {string} userId - The user ID to get alerts for
 * @returns {Promise<Array>} Array of alert objects for the user
 */
export const mockGetUserAlerts = async (userId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockAlerts.filter(alert => alert.userId === userId);
};

/**
 * Mock implementation of the getAllAIReports API endpoint
 * @returns {Promise<Array>} Array of AI report objects
 */
export const mockGetAllAIReports = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockAIReports];
};

/**
 * Mock implementation of the getUserAIReports API endpoint
 * @param {string} userId - The user ID to get AI reports for
 * @returns {Promise<Array>} Array of AI report objects for the user
 */
export const mockGetUserAIReports = async (userId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockAIReports.filter(report => report.userId === userId);
};

/**
 * Mock implementation of the generateSampleData API endpoint
 * @param {number} alertCount - Number of sample alerts to generate
 * @param {number} reportCount - Number of sample AI reports to generate
 * @param {string} userId - User ID to associate with the sample data
 * @returns {Promise<Object>} Result of the sample data generation
 */
export const mockGenerateSampleData = async (alertCount = 5, reportCount = 5, userId = 'system') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    success: true,
    message: `Generated ${alertCount} alerts and ${reportCount} AI reports for user ${userId}`,
    data: {
      alerts: mockAlerts.slice(0, alertCount),
      reports: mockAIReports.slice(0, reportCount)
    }
  };
};
