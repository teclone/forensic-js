import Queue from '../../src/modules/Queue.js';

describe('Queue module', function() {
    describe('.fnSort()', function() {
        it(`the Queue's static fnSort() method or user defined sort method should accept two
        arguments, and return a negative number if the first should come before the second,
        postive number if the first should come after the second, or 0 if they are both equal`, function() {

            expect(Queue.fnSort(0, 0)).to.equals(0);
            expect(Queue.fnSort(2, 10)).to.equals(-1);
            expect(Queue.fnSort(20, 10)).to.equals(1);
            expect(Queue.fnSort(0, 'string')).to.equals(-1);
            expect(Queue.fnSort('string', 1)).to.equals(1);

            expect(Queue.fnSort('harrison', 'jack')).to.equals(-1);
            expect(Queue.fnSort('jack', 'harrison')).to.equals(1);
            expect(Queue.fnSort('harrison', 'Harrison')).to.equals(-1);
            expect(Queue.fnSort('harrison', [])).to.equals(-1);
            expect(Queue.fnSort({}, 'harrison')).to.equals(1);

            expect(Queue.fnSort([], {})).to.equals(-1);
        });
    });

    describe('.fnSearch()', function() {
        it(`the Queue's static fnSearch() method or user defined search method should accept
        three arguments, key to search, item being compared to, and a boolean caseSensitive
        value as passed in during the instance creation. It should return a negative number if
        the key should come before the item, postive number if the key should come after the
        item, or 0 if they are both equal`, function() {

            expect(Queue.fnSearch(0, 0)).to.equals(0);
            expect(Queue.fnSearch(2, 10)).to.equals(-1);
            expect(Queue.fnSearch(20, 10)).to.equals(1);
            expect(Queue.fnSearch(0, 'string')).to.equals(-1);
            expect(Queue.fnSearch('string', 1)).to.equals(1);

            expect(Queue.fnSearch('harrison', 'jack')).to.equals(-1);
            expect(Queue.fnSearch('jack', 'harrison')).to.equals(1);
            expect(Queue.fnSearch('harrison', 'Harrison')).to.equals(0);
            expect(Queue.fnSearch('harrison', 'Harrison', true)).to.equals(-1);

            expect(Queue.fnSearch('harrison', [])).to.equals(-1);
            expect(Queue.fnSearch({}, 'harrison')).to.equals(1);

            expect(Queue.fnSearch([], {})).to.equals(-1);
        });
    });

    describe('#constructor(items?, sortable?, caseSensitive?, fnSort?, fnSearch?)', function() {
        it('should create a Queue object', function() {
            expect(new Queue()).to.be.a('Queue');
        });

        it('should create a queue and populate it with the item or array of items provided.', function() {
            expect(new Queue()).to.be.lengthOf(0);
            expect(new Queue(2)).to.be.lengthOf(1);
            expect(new Queue([1, 2, 3, 4])).to.be.lengthOf(4);
        });

        it(`should sort items if the optional sortable parameter is set to true. It uses the
            'class static fnSort() method when no search function is configured`, function() {
            expect((new Queue([4, 3, 6, 9, 5, 1, 20, 11], true)).items)
                .to.deep.equals([1, 3, 4, 5, 6, 9, 11, 20]);
        });

        it('should accept a second optional boolean argument indicating if queue should be sorted', function() {
            //create sortable queue
            let sortableQueue = new Queue(['James', 'james', 'jaMes', 3, 1], true);

            expect(sortableQueue.sortable).to.be.true;
            expect(sortableQueue.items).to.deep.equals([1, 3, 'James', 'james', 'jaMes']);

            //create a non sortable queue
            let queue = new Queue(['James', 'james', 'jaMes', 3, 1], false);

            expect(queue.sortable).to.be.false;
            expect(queue.items).to.deep.equals(['James', 'james', 'jaMes', 3, 1]);
        });

        it('should accept a third optional boolean argument indicating if queue is case sensitive', function() {
            //create a case sensitive queue
            let caseSensitiveQueue = new Queue(['James', 3, 1], true, true);
            expect(caseSensitiveQueue.caseSensitive).to.be.true;

            //create a non case sensitive queue
            let caseInsensitiveQueue = new Queue(['James', 3, 1], true, false);
            expect(caseInsensitiveQueue.caseSensitive).to.be.false;
        });

        it('should accept a fourth optional default sort function argument', function() {

            // default sort function
            let sortFunction = function(one, two) {
                return Queue.fnSort(one.id, two.id);
            };

            let queue = new Queue(null, true, true, sortFunction);
            expect(queue.fnSort).to.equals(sortFunction);
        });

        it('should accept a fifth optional default search function argument', function() {

            // default sort function
            let searchFunction = function(one, two, caseSensitive) {
                return Queue.fnSearch(one.id, two.id, caseSensitive);
            };

            let queue = new Queue(null, true, true, null, searchFunction);
            expect(queue.fnSearch).to.equals(searchFunction);
        });
    });

    describe('#addSortFunction(criteria, fnSort)', function() {
        it('should add alternate sort function based on a given criteria', function() {
            //create empty queue that uses Queue's default static fnSort method
            let queue = new Queue(null, true);

            expect(queue.alternateFnSorts).to.deep.equals({});
            let sortFunction = (item1, item2) => {
                return Queue.fnSort(item1.id, item2.id);
            };

            queue.addSortFunction('by-id', sortFunction);

            expect(queue.alternateFnSorts).to.deep.equals({
                'by-id': sortFunction
            });
        });

        it('should throw TypeError if argument one is not a string', function() {
            let queue = new Queue(null, true);
            expect(function() {
                queue.addSortFunction(null);
            }).to.throw(TypeError);
        });

        it('should throw TypeError if argument two is not a function', function() {
            let queue = new Queue(null, true);
            expect(function() {
                queue.addSortFunction('by-id', null);
            }).to.throw(TypeError);
        });
    });

    describe('#getSortFunction(criteria?)', function() {
        it(`should return the sort function defined for the given criteria`, function() {
            // create empty queue that uses Queue's default static fnSort method
            let queue = new Queue(null, true);

            let sortById = function(item1, item2) {
                return Queue.fnSort(item1.id, item2.id);
            };
            queue.addSortFunction('by-id', sortById);
            expect(queue.getSortFunction('by-id')).to.equals(sortById);
        });

        it(`should return the default sort function if no criteria is specified`, function() {
            //create empty queue that uses Queue's default static fnSort method
            let queue = new Queue(null, true);
            expect(queue.getSortFunction()).to.equals(Queue.fnSort);
        });

        it(`should throw error if there is no sort function defined for the given criteria`, function() {
            //create empty queue that uses Queue's default static fnSort method
            let queue = new Queue(null, true);
            expect(function() {
                expect(queue.getSortFunction('by-age')).to.equals(Queue.fnSort);
            }).to.throw(Error);
        });
    });

    describe('#addSearchFunction(criteria, fnSearch)', function() {
        it('should add alternate search function based on a given criteria', function() {
            //create empty queue that uses Queue's default static fnSearch method
            let queue = new Queue(null, true);

            expect(queue.alternateFnSearchs).to.deep.equals({});
            let searchFunction = (key, item, caseSensitive) => {
                return Queue.fnSearch(key, item.id, caseSensitive);
            };

            queue.addSearchFunction('by-id', searchFunction);

            expect(queue.alternateFnSearchs).to.deep.equals({
                'by-id': searchFunction
            });
        });

        it('should throw TypeError if argument one is not a string', function() {
            let queue = new Queue(null, true);
            expect(function() {
                queue.addSearchFunction(null);
            }).to.throw(TypeError);
        });

        it('should throw TypeError if argument two is not a function', function() {
            let queue = new Queue(null, true);
            expect(function() {
                queue.addSearchFunction('by-id', null);
            }).to.throw(TypeError);
        });
    });

    describe('#getSearchFunction(criteria?)', function() {
        it(`should return the search function defined for the given criteria`, function() {
            // create empty queue that uses Queue's default static fnSearch method
            let queue = new Queue(null, true);

            let searchById = function(key, item, caseSensitive) {
                return Queue.fnSort(key, item.id, caseSensitive);
            };
            queue.addSearchFunction('by-id', searchById);
            expect(queue.getSearchFunction('by-id')).to.equals(searchById);
        });

        it(`should return the default search function if no criteria is specified`, function() {
            //create empty queue that uses Queue's default static fnSort method
            let queue = new Queue(null, true);
            expect(queue.getSearchFunction()).to.equals(Queue.fnSearch);
        });

        it(`should throw error if there is no search function defined for the given criteria`, function() {
            //create empty queue that uses Queue's default static fnSearch method
            let queue = new Queue(null, true);
            expect(function() {
                expect(queue.getSearchFunction('by-age')).to.equals(Queue.fnSearch);
            }).to.throw(Error);
        });
    });

    describe('#Sort(criteria?)', function() {
        it('should sort the queue using the default sort function if no criteria is given', function() {
            expect((new Queue([4, 3, 6, 9, 5, 1, 20, 11], true)).items).to.deep
                .equals([1, 3, 4, 5, 6, 9, 11, 20]);
        });

        it('should sort the queue based on a given criteria if specified and return the this object', function() {
            //create empty queue that uses Queue's default static fnSort method
            let queue = new Queue(null, true);
            //push in some items
            queue.push({id: 2, name: 'Rebecca'}, {id: 4, name: 'John'}, {id: 1, name: 'James'});

            /**
             * add two sort functions based on item's id and name criteria.
             * both reuses Queue's static fnSort method to maintain accuracy
             */
            queue.addSortFunction('by-id', function(item1, item2) {
                return Queue.fnSort(item1.id, item2.id);
            })
                .addSortFunction('by-name', function(item1, item2) {
                    return Queue.fnSort(item1.name, item2.name);
                });

            expect(queue.sort('by-name')).to.equals(queue); // sort it by name. we could sort by id too

            expect(queue.items).to.deep.equals([
                {id: 1, name: 'James'},
                {id: 4, name: 'John'},
                {id: 2, name: 'Rebecca'}
            ]);
        });
    });
});