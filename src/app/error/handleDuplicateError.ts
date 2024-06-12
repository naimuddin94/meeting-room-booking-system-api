/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleDuplicateError = (err: any) => {
  //   const match = err.message.match(/"([^"]*)"/);
  //   const extractedMessage = match && match[1];
  return {
    statusCode: 400,
    message: 'Duplicate field',
    errors: [
      {
        path: Object.keys(err?.keyValue).join(', '),
        message: `${Object.values(err?.keyValue).join(', ')} is already exists`,
      },
    ],
  };
};
