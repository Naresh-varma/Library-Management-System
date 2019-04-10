/* eslint-disable max-len */
'use strict';
/* 'use strict';

module.exports = (app) => {
  app.models.Student.upsert({
    id: '5caaf22cc82c9706c8d5c8dc',
    email: 'admin@applaud.com',
    password: 'admin',
  }, (err, admin) => {
    console.log(admin);
    app.models.RoleGrant.upsert({
      name: 'Admin',
    }, (err, role) => {
      role.principals.create({
        principalType: app.models.RoleMapping.USER,
        principalId: '5caaf22cc82c9706c8d5c8dc',
        roleId: role.id,
      }, (err, map) => {
        console.log('1111');
      });
    });
  });
};
*/
module.exports = (app) => {
  // app.models.Student.exists('5caaf22cc82c9706c8d5c8dc', (err, exists) => {
  //   if (err) console.log(err);
  //   if (exists) {
  //     app.models.RoleGrant.upsert({
  //       id: '5cac2db0874f38311cba02f7',
  //       name: 'admin',
  //     }, function(err, role) {
  //       if (err) console.log(err);
  //       console.log(role);
  //       app.models.RoleMapping.exists('5cac329ad5c968106cf8ea3c', (err, exists) => {
  //         if (err) console.log(err);
  //         if (!exists) {
  //           role.principals.create({
  //             id: '5cac329ad5c968106cf8ea3c',
  //             principalType: app.models.RoleMapping.USER,
  //             principalId: '5caaf22cc82c9706c8d5c8dc',
  //           }, function(err, principal) {
  //             console.log(principal);
  //           });
  //         }
  //       });
  //     });
  //   }
  //   if (!exists) {
  //     app.models.Student.create([
  //       {
  //         id: '5caaf22cc82c9706c8d5c8dc',
  //         email: 'admin@applaud.com',
  //         password: 'admin',
  //       },
  //     ], function(err, admin) {
  //       if (err) return console.log(err);
  //       app.models.RoleGrant.upsert({
  //         id: '5cac2db0874f38311cba02f7',
  //         name: 'admin',
  //       }, function(err, role) {
  //         if (err) console.log(err);
  //         console.log(role);
  //         app.models.RoleMapping.exists('5cac329ad5c968106cf8ea3c', (err, exists) => {
  //           if (err) console.log(err);
  //           if (!exists) {
  //             role.principals.create({
  //               id: '5cac329ad5c968106cf8ea3c',
  //               principalType: app.models.RoleMapping.USER,
  //               principalId: '5caaf22cc82c9706c8d5c8dc',
  //             }, function(err, principal) {
  //               console.log(principal);
  //             });
  //           }
  //         });
  //       });
  //     });
  //   }
  // });
};
