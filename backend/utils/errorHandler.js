export const handleError = (res, error, customMessage = "Internal server error") => {
    console.error(customMessage, error.message); // Log the error for debugging
    res.status(500).json({
        message: customMessage,
        error: error.message,
    });
};
