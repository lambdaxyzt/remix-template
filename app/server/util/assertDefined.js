const assertDefined = (condition,errorMessage,errorCode)=>{
    if (!condition) {
        throw new Response(errorMessage || "Not Found", { status: errorCode || 400 })
    }
}

export default assertDefined