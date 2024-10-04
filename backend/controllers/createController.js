const createOperation = {
    async operation(req, res) {
        return res.status(200).json({status: 200, code: 1, data: {}, message: "createOperation response received", error: null});
    }
}

export default createOperation;