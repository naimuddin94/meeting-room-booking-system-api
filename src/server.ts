/* eslint-disable no-console */
/*
 * Title: Meeting Room 
 * Description: A meeting room booking system application.
 * Author: Md Naim Uddin
 * Date: 12/06/2024
 *
 */

import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

(async () => {
  try {
    await mongoose.connect(config.db_uri!);
    console.log('Database connection established 🎉');
    app.listen(config.port, () => {
      console.log(`server listening on ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
