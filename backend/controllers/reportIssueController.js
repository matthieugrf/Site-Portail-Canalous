exports.reportIssue = async (req, res) => {
    const { issueDescription, location } = req.body;
  
    try {
      // Logique pour signaler un problème
      res.json({ message: 'Issue reported successfully' });
    } catch (error) {
      console.error('Error reporting issue:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  