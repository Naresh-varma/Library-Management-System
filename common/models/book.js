/* eslint-disable camelcase */
/* eslint-disable max-len */
'use strict';
module.exports = function(Book) {
  // Book.return = function(ctx, cb) {
  //   Book.findOne({
  //     where: {
  //       id: ctx.req.body.book_Id,
  //     },
  //   }, function(err, book) {
  //     if (err) throw err;
  //     if (book) {
  //       book.updateAttribute('copies_Issued', book.copies_Issued - 1, function(err, instance) {
  //         if (err) throw err;
  //         Book.app.models.Transaction.findOne({
  //           where: {
  //             user_Id: ctx.req.body.user_Id,
  //             book_Id: ctx.req.body.book_Id,
  //             isReturned: false,
  //           },
  //         }, function(err, transactionInstance) {
  //           if (err) throw err;
  //           if (transactionInstance) {
  //             if (transactionInstance.fine == 0) {
  //               // take it
  //             } else {
  //               // ask for the fine
  //             }
  //           } else {
  //             // no such transaction
  //           }
  //         });
  //       });
  //     } else {
  //       cb('No such book found');
  //     }
  //   });
  // };
  // Book.remoteMethod('return', {
  //   http: {
  //     path: '/return',
  //     verb: 'post',
  //   },
  //   returns: {
  //     arg: 'status',
  //     type: 'String',
  //   },
  //   accepts: [
  //     {arg: 'ctx', type: 'object', http: {source: 'context'}},
  //   ],
  // });
};
