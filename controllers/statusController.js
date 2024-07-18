import Request from '../models/requestModel.js';

const checkStatus = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await Request.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.status(200).json({ status: request.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve status' });
  }
};

export { checkStatus };
