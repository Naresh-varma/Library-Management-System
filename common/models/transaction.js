/* eslint-disable camelcase */
/* eslint-disable max-len */
'use strict';
const moment = require('moment');
module.exports = function(Transactions) {
  Transactions.beforeRemote('create', function(context, unused, next) {
    Transactions.app.models.Book.findById(context.req.body.book_Id, (err, book) => {
      if (err) throw err;
      console.log(book);
      if (book.copies_Issued == book.total_Number_Copies) {
        next(new Error('No books avilable at library'));
      }
      Transactions.find({
        where: {
          user_Id: context.req.body.user_Id,
          isReturned: false,
        },
      }, function(err, userAllBooks) {
        if (err) throw err;
        if (userAllBooks.length >= 5) {
          next(new Error('Limit Exceeded'));
        } else {
          Transactions.findOne({
            where: {
              user_Id: context.req.body.user_Id,
              book_Id: context.req.body.book_Id,
              isReturned: false,
            },
          }, function(err, transaction) {
            if (err) throw err;
            if (transaction) next(new Error('Soory you have already taken the same book'));
            else  {
              console.log('working give him a book');
              next();
            }
          });
        }
      });
    });
  });
  Transactions.afterRemote('create', function(context, createmethodoutput, next) {
    Transactions.app.models.Book.findById(createmethodoutput.book_Id, function(err, instance) {
      if (err) throw err;
      let value = Number(instance.copies_Issued) + 1;
      instance.updateAttribute('copies_Issued', value, function(err, instance) {
        if (err) throw err;
        console.log('successfully updated: ' + instance);
      });
    });
    next();
  });
  Transactions.afterRemote('find', function(context, findOutput, next) {
    if (context.req.query.getfine == 'true') {
      // calculate all fines and send the data for isReturned == false
      console.log(findOutput);
      findOutput.forEach((item, index) => {
        if (item.isReturned == false && (moment().diff(item.return_By_This_Date, 'days') + 1) > 0) {
          console.log((moment().diff(item.return_By_This_Date, 'days') + 1));
          findOutput[index].fine = (moment().diff(item.return_By_This_Date, 'days') + 1);
        }
      });
    }
    next();
  });
  Transactions.return = function(ctx, cb) {
    Transactions.findOne({
      where: {
        user_Id: ctx.req.body.user_Id,
        book_Id: ctx.req.body.book_Id,
        isReturned: false,
      },
    }, function(err, transactionInstance) {
      if (err) throw cb(err);
      if (transactionInstance) {
        console.log('check for fine' + (moment().diff(transactionInstance.return_By_This_Date, 'days') + 1));
        if ((moment().diff(transactionInstance.return_By_This_Date, 'days') + 1) <= 0) {
          // take it
          // if (transactionInstance.fine == 0) {
          Transactions.app.models.Book.findOne({
            where: {
              id: ctx.req.body.book_Id,
            },
          }, function(err, bookInstance) {
            if (err) throw cb(err);
            if (bookInstance) {
              bookInstance.updateAttribute('copies_Issued', bookInstance.copies_Issued - 1, function(err, updatedbookinstance) {
                if (err) throw err;
                if (updatedbookinstance) {
                  transactionInstance.updateAttributes({
                    returned_Date: Date.now(),
                    isReturned: true,
                  }, function(err, instance) {
                    if (err) throw err;
                    if (instance) {
                      cb(null, 'Book returned succesfully');
                    } else {
                      cb('Book Not returned');
                    }
                  });
                }
              });
            }
          });
        } else {
          // ask for the fine
          cb('Please pay fine amount');
        }
      } else {
        // no such transaction
        cb('no such transaction');
      }
    });
  };
  Transactions.remoteMethod('return', {
    http: {
      path: '/return',
      verb: 'post',
    },
    returns: {
      arg: 'status',
      type: 'String',
    },
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
    ],
  });
  Transactions.returnWithFine = function(ctx, cb) {
    console.log(typeof ctx.req.body.bookIds);
    if (ctx.req.body.bookIds.length == 0) {
      return cb('zero length');
    }
    let promises = [];
    ctx.req.body.bookIds.forEach(item => {
      promises.push(clearFine(ctx.req.body.user_Id, item));
    });
    Promise.all(promises)
      .then(() => { cb(null, 'Returned Succesfully'); })
      .catch(() => { cb(new Error('Books not returned')); });
  };
  Transactions.remoteMethod('returnWithFine', {
    http: {
      path: '/returnWithFine',
      verb: 'post',
    },
    returns: {
      arg: 'status',
      type: 'String',
    },
    accepts: [
      {arg: 'ctx', type: 'object', http: {source: 'context'}},
    ],
  });

  const clearFine = (userId, bookId) => new Promise((resolve, reject) => {
    Transactions.findOne({
      where: {
        user_Id: userId,
        book_Id: bookId,
        isReturned: false,
      },
    }, function(err, transactionInstance) {
      if (err) throw reject(err);
      if (transactionInstance) {
        // console.log('check for fine' + (moment().diff(transactionInstance.return_By_This_Date, 'days') + 1));
        // take it
        // if (transactionInstance.fine == 0) {
        Transactions.app.models.Book.findOne({
          where: {
            id: bookId,
          },
        }, function(err, bookInstance) {
          if (err) throw reject(err);
          if (bookInstance) {
            bookInstance.updateAttribute('copies_Issued', bookInstance.copies_Issued - 1, function(err, updatedbookinstance) {
              if (err) throw err;
              if (updatedbookinstance) {
                transactionInstance.updateAttributes({
                  returned_Date: Date.now(),
                  isReturned: true,
                  fine: (moment().diff(transactionInstance.return_By_This_Date, 'days') + 1),
                }, function(err, instance) {
                  if (err) throw err;
                  if (instance) {
                    return resolve(null, 'Book returned succesfully');
                  } else {
                    return reject('Book Not returned');
                  }
                });
              }
            });
          }
        });
      } else {
        // no such transaction
        return reject('no such transaction');
      }
    });
  });
};

