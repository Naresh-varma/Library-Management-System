/* eslint-disable camelcase */
/* eslint-disable max-len */
'use strict';
module.exports = function(Transactions) {
  Transactions.beforeRemote('create', function(context, unused, next) {
    Transactions.app.models.Book.findById(context.req.body.book_Id, (err, book) => {
      if (err) throw err;
      console.log(book);
      if (book.copies_Issued == book.total_Number_Copies) {
        next(new Error('No books avilable at library'));
      }
      Transactions.findOne({
        where: {
          user_Id: context.req.body.user_Id,
          book_Id: context.req.body.book_Id,
        }},
        function(err, transaction) {
          if (err) throw err;
          if (transaction) next(new Error('Soory you have already taken the same book'));
          else  {
            console.log('working give him a book');
            next();
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
  Transactions.return = function(ctx, cb) {
    Transactions.findOne({
      where: {
        user_Id: ctx.req.body.user_Id,
        book_Id: ctx.req.body.book_Id,
        isReturned: false,
      },
    }, function(err, transactionInstance) {
      if (err) throw err;
      if (transactionInstance) {
        if (transactionInstance.fine == 0) {
          // take it
          Transactions.app.models.Book.findOne({
            where: {
              id: ctx.req.body.book_Id,
            },
          }, function(err, bookInstance) {
            if (err) throw err;
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
};
