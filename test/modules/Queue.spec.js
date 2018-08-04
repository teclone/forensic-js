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

            expect(Queue.fnSort([], {})).to.equals(0);
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
            expect(sortableQueue.items).to.deep.equals([1, 3, 'james', 'jaMes', 'James']);

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

    describe('#addSortFunctions(entries)', function() {
        it(`should take an object containing sort criteria and functions as key:value pair and
        add them to the list of alternate sort functions. It uses #addSortFunction under the hood`, function() {
            //create empty queue that uses Queue's default static fnSort && fnSearch methods
            let queue = new Queue(null, true);

            let sortById = (item1, item2) => {
                    return Queue.fnSort(item1.id, item2.id);
                },
                sortByName = (item1, item2) => {
                    return Queue.fnSort(item1.name, item2.name);
                };

            /**
             * add two sort functions based on item's id and name criteria.
             * both reuses Queue's static fnSort method to maintain accuracy
            */
            queue.addSortFunctions({
                'by-id': sortById,
                'by-name': sortByName
            });

            expect(queue.alternateFnSorts).to.deep.equals({
                'by-id': sortById,
                'by-name': sortByName
            });
        });

        it('should throw TypeError if entries is not a plain object', function() {
            let queue = new Queue(null, true);
            expect(function() {
                queue.addSortFunctions(null);
            }).to.throw(TypeError);
        });
    });

    describe('#addSearchFunctions(entries)', function() {
        it(`should take an object containing search criteria and functions as key:value pair and
        add them to the list of alternate search functions. It uses #addSearchFunction under the hood`, function() {
            //create empty queue that uses Queue's default static fnSort && fnSearch methods
            let queue = new Queue(null, true);

            let searchById = (key, item, caseSensitive) => {
                    return Queue.fnSearch(key, item.id, caseSensitive);
                },
                searchByName = (key, item, caseSensitive) => {
                    return Queue.fnSearch(key, item.name, caseSensitive);
                };

            /**
             * add two search functions based on item's id and name criteria.
             * both reuses Queue's static fnSearch method to maintain accuracy
            */
            queue.addSearchFunctions({
                'by-id': searchById,
                'by-name': searchByName
            });

            expect(queue.alternateFnSearchs).to.deep.equals({
                'by-id': searchById,
                'by-name': searchByName
            });
        });

        it('should throw TypeError if entries is not a plain object', function() {
            let queue = new Queue(null, true);
            expect(function() {
                queue.addSearchFunctions(null);
            }).to.throw(TypeError);
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

    describe('#length', function() {
        let queue = new Queue();
        it('should return the number of items in the queue', function() {
            expect(queue.length).to.equals(0);
        });

        it('should get updated when the number of items in the queue changes', function() {
            queue.push('first');
            expect(queue.length).to.equals(1);
        });
    });

    describe('#screen(item)', function() {
        it(`it should guard the queue and screen out null and undefined values before they
        are put into the queue`, function() {
            expect((new Queue([null, undefined, 1, 'hey'], true)).items).to.deep.equals([1, 'hey']);
        });
    });

    describe('#toArray()', function() {
        it('should return all items in the queue as an array', function() {
            let queue = new Queue([1, 3, 4], false);
            expect(queue.toArray()).to.be.an('array').and.to.deep.equals([1, 3, 4]);
        });
    });

    describe('#[Symbol.iterator]()', function() {
        it('should implement the iterable interface making queues to be iterable', function() {
            let queue = new Queue([1, 2]),
                sum = 0;
            for (const item of queue)
                sum += item;
            expect(sum).to.equals(3);
        });

        it('should take care and account for item deletions, not missing any item as a result', function() {
            let queue = new Queue([1, 2, 4, 5]),
                sum = 0;
            for (const item of queue) {
                sum += item;
                queue.items.shift();
            }
            expect(sum).to.equals(12);
        });
    });

    describe('#push(...items)', function() {
        it(`should add comma separated list of items that satisfies the screen test to the
        end of the queue and return the this object`, function() {
            let queue = new Queue([1, 2], false);

            expect(queue.push(3, 4, null, undefined, 5, 6)).to.equals(queue);
            expect(queue.toArray()).to.deep.equals([1, 2, 3, 4, 5, 6]);
        });
    });

    describe('#unshift(...items)', function() {
        it(`should add comma separated list of items that satisfies the screen test to the
         beginning of the queue, shifting existing items accordingly`, function() {
            let queue = new Queue([7, 8], false);

            queue.unshift(null, 3, 4, undefined, 5, 6);
            expect(queue.toArray()).to.deep.equals([3, 4, 5, 6, 7, 8]);
        });
    });

    describe('#put(item, pos?, replace?)', function() {
        it('should push the item to the end of the queue if it passes the screen test', function() {
            let queue = new Queue([1, 3], false);
            queue.put(5);
            expect(queue.toArray()).to.deep.equals([1, 3, 5]);
        });

        it('should do nothing if item fails the screen test', function() {
            let queue = new Queue([1, 3], false);
            queue.put(null);
            expect(queue.toArray()).to.deep.equals([1, 3]);
        });

        it(`should accept a second optional pos argument that specifies the index position to put
        the item. It does not replace existing item by default`, function() {
            let queue = new Queue([1, 3], false);
            queue.put(2, 1);
            expect(queue.toArray()).to.deep.equals([1, 2, 3]);
        });

        it(`should replace existing item at the given index position if the third boolean
        replace argument is set to true`, function() {
            let queue = new Queue([1, 3], false);
            queue.put(2, 1, true);
            expect(queue.toArray()).to.deep.equals([1, 2]);
        });
    });

    describe('#item(pos)', function() {
        let queue = null;

        beforeEach(function() {
            queue = new Queue([1, 2, 3, 4], false);
        });
        it('should return the item at the given index position', function() {
            expect(queue.item(0)).to.equals(1);
        });

        it('should return the item by calculating position from the end if index is negative', function() {
            expect(queue.item(-2)).to.equals(3);
        });

        it('should return undefined if index is out of range or if no index is given', function() {
            expect(queue.item(-5)).to.be.undefined;
            expect(queue.item()).to.be.undefined;
        });
    });

    describe('#shift()', function() {
        it('should remove and return the first item in the queue', function() {
            let queue = new Queue([1, 2, 3, 4], false);
            expect(queue.shift()).to.equals(1);
            expect(queue.length).to.equals(3);
        });
        it('should return undefined for all calls on empty queue', function() {
            let queue = new Queue(null, false);
            expect(queue.shift()).to.be.undefined;
        });
    });

    describe('#pop()', function() {
        it('should remove and return the last item in the queue', function() {
            let queue = new Queue([1, 2, 3, 4], false);
            expect(queue.pop()).to.equals(4);
            expect(queue.length).to.equals(3);
        });
        it('should return undefined for all calls on empty queue', function() {
            let queue = new Queue(null, false);
            expect(queue.pop()).to.be.undefined;
        });
    });

    describe('#first()', function() {
        it('should return the first item in the queue without removing it', function() {
            let queue = new Queue([1, 2, 3, 4], false);
            expect(queue.first()).to.equals(1);
            expect(queue.length).to.equals(4);
        });
        it('should return undefined for all calls on empty queue', function() {
            let queue = new Queue(null, false);
            expect(queue.first()).to.be.undefined;
        });
    });

    describe('#last()', function() {
        it('should return the last item in the queue without removing it', function() {
            let queue = new Queue([1, 2, 3, 4], false);
            expect(queue.last()).to.equals(4);
            expect(queue.length).to.equals(4);
        });
        it('should return undefined for all calls on empty queue', function() {
            let queue = new Queue(null, false);
            expect(queue.last()).to.be.undefined;
        });
    });

    describe('#empty()', function() {
        it('should empty the queue when called and return this', function() {
            let queue = new Queue([1, 3, 4, 5]);
            expect(queue.empty()).to.equals(queue).and.to.be.lengthOf(0);
        });
    });

    describe('#deleteIndex(index)', function() {
        let queue = null;

        beforeEach(function() {
            queue = new Queue([1, 2, 3]);
        });

        it('should delete the item at the given index position', function() {
            expect(queue.deleteIndex(0)).to.be.lengthOf(2);
            expect(queue.toArray()).to.deep.equals([2, 3]);
        });

        it('should delete the item by calculating position from the end if index is negative', function() {
            expect(queue.deleteIndex(-2)).to.be.lengthOf(2);
            expect(queue.toArray()).to.deep.equals([1, 3]);
        });

        it('should do nothing if index is not a number, or it is out of range', function() {
            expect(queue.deleteIndex(-5)).to.be.lengthOf(3);
            expect(queue.deleteIndex()).to.be.lengthOf(3);
        });

        it('should do nothing if queue is empty', function() {
            queue.empty();
            expect(queue.deleteIndex(0)).to.be.lengthOf(0);
        });
    });

    describe('search methods', function() {
        let queue = null;

        beforeEach(function() {
            let defaultSortFunction = (item1, item2) => {
                    return Queue.fnSort(item1.id, item2.id);
                },
                defaultSearchFunction = (key, item, caseSensitive) => {
                    return Queue.fnSearch(key, item.id, caseSensitive);
                };
            queue = new Queue([
                {id: 3, name: 'Emmanuel', level: 200},
                {id: 1, name: 'Harrison', level: 100},
                {id: 2, name: 'Onyedikachi', level: 500},

            ], true, true, defaultSortFunction, defaultSearchFunction);

            queue.addSortFunction('by-name', (item1, item2) => {
                return Queue.fnSort(item1.name, item2.name);
            });
            queue.addSearchFunction('by-name', (key, item, caseSensitive) => {
                return Queue.fnSearch(key, item.name, caseSensitive);
            });
        });

        describe('#indexOf(key, criteria?)', function() {
            it(`should search the queue and return item index position if item is found, it
            uses the default search method if search criteria is not specified`, function() {
                let queue = new Queue([1, 3, 5, 4, 6, 'Harrison', 'harrison', 'harrY',
                    'harrISon', 'jack', 'JaCk', 'jay', 'Lovren', 'LoVren', 'Harris', 'Mon',
                    'moN'], true, true);

                let i = 0;
                for (let item of queue) {
                    expect(queue.indexOf(item)).to.equals(i);
                    i += 1;
                }
            });

            it(`should do no search and return -1 if queue is empty`, function() {
                let queue = new Queue([], true, true);
                expect(queue.indexOf(4)).to.equals(-1);
            });

            it(`should do no search and return -1 if search key is not defined or null`, function() {
                let queue = new Queue([1, 2, 3], true, true);
                expect(queue.indexOf(undefined)).to.equals(-1);
                expect(queue.indexOf(null)).to.equals(-1);
            });

            it(`should iterate over the queue when searching a non sortable queue or searching for an object using Queue's fnSearch method`, function() {
                let queue = new Queue(['Harrison', 1, 2, 3, 'Joy'], false, false); //case insensitive
                expect(queue.indexOf('joy')).to.equals(4);
                expect(queue.indexOf('Juan')).to.equals(-1);

                let obj = {id: 'tester'};
                queue = new Queue([3, 9, 5, obj, 0], true);
                expect(queue.indexOf(obj)).to.equals(4);
            });

            it('should use the corresponding sort and search methods for the given search criteria', function() {
                expect(queue.indexOf('Harrison', 'by-name')).to.equals(1);
            });

            it('should return -1 if item with given criteria is not found', function() {
                expect(queue.indexOf(4)).to.equals(-1);
            });

            it('should throw error if there is no sort or search function defined for the given criteria', function() {
                expect(function() {
                    queue.indexOf(4, 'by-age');
                }).to.throw(Error);
            });
        });

        describe('#includes(key, criteria?)', function() {
            it(`should return true if item is found, else return false. It is an aliase for the #has(key, criteria?) method`, function() {
                expect(queue.includes(1)).to.be.true;
                expect(queue.includes(4)).to.be.false;
            });

            it('should use the corresponding sort and search methods for the given search criteria', function() {
                expect(queue.includes('Harrison', 'by-name')).to.be.true;
                expect(queue.includes('Angela', 'by-name')).to.be.false;
            });
        });

        describe('#find(key, criteria?, deleteIfFound?)', function() {
            it('should return the item if found. It relies on the #indexOf(key, criteria?) method', function() {
                expect(queue.find(1)).to.deep.equals({id: 1, name: 'Harrison', level: 100});
            });

            it(`should delete the item before returning it if the third deleteIfFound
                argument is set to true`, function() {
                queue.find(1, '', true);
                expect(queue.length).to.equals(2);
            });

            it(`should return undefined if item with given criteria is not found`, function() {
                expect(queue.find(4)).to.be.undefined;
            });
        });

        describe('#deleteItem(item, criteria?)', function() {
            it(`should delete the item if found. It relies on the #indexOf(key, criteria?)
            method. it returns the this object`, function() {
                expect(queue.deleteItem(1, '')).to.equals(queue);
                expect(queue.length).to.equals(2);
            });

            it(`should do nothing if item does not exist`, function() {
                queue.deleteItem(4, '');
                expect(queue.length).to.equals(3);
            });
        });
    });

    describe('#cloneWith(items?)', function() {
        it(`should clone the queue internals with the given optional item or array of items`, function() {
            let sortFunction = function(item1, item2) {
                    return Queue.fnSort(item1.id, item2.id);
                },
                searchFunction = function(key, item, caseSensitive) {
                    return Queue.fnSearch(key, item.id, caseSensitive);
                },
                sortByName = function(item1, item2) {
                    return Queue.fnSort(item1.name, item2.name);
                },
                searchByName = function(key, item, caseSensitive) {
                    return Queue.fnSearch(key, item.name, caseSensitive);
                };

            let queue = new Queue([

                {id: 3, name: 'Emmanuel', level: 200},
                {id: 1, name: 'Harrison', level: 100},
                {id: 2, name: 'Onyedikachi', level: 500},

            ], true, true, sortFunction, searchFunction);

            queue.addSortFunction('by-name', sortByName)
                .addSearchFunction('by-name', searchByName);

            let clone = queue.cloneWith(null); //get clone with empty items

            expect(clone).to.be.lengthOf(0);

            expect(queue.sortable).to.equals(clone.sortable);
            expect(queue.caseSensitive).to.equals(clone.caseSensitive);

            expect(queue.fnSort).to.equals(clone.fnSort);
            expect(queue.fnSearch).to.equals(clone.fnSearch);

            expect(queue.getSortFunction('by-name')).to.equals(clone.getSortFunction('by-name'));
            expect(queue.getSearchFunction('by-name')).to.equals(clone.getSearchFunction('by-name'));
        });
    });

    describe('#clone()', function() {
        it(`should clone and return the clone`, function() {
            let queue = new Queue([1,2,3,4]),
                clone = queue.clone();
            expect(queue).to.deep.equals(clone);
        });
    });

    describe('#forEach(callback, scope?, ...parameters?)', function() {
        let queue = null;
        beforeEach(function() {
            queue = new Queue([2, 4, 6, 8]);
        });

        it(`should call the callback function on every item in the queue passing in the
        current item, its index and queue as parameters`, function() {
            let sumOfIndex = 0,
                sumOfItems = 0;

            queue.forEach((item, index) => {
                sumOfIndex += index;
            });

            expect(sumOfIndex).to.equals(6);

            queue.forEach((item) => {
                sumOfItems += item;
            });

            expect(sumOfItems).to.equals(20);
        });

        it(`should exit the iteration once the method returns anything that is not undefined`, function() {
            let callCount = 0;
            queue.forEach(() => {
                callCount += 1;
                return 0;
            });

            expect(callCount).to.equals(1);
        });

        it('should throw TypeError if argument one is not a function', function() {
            expect(function() {
                queue.forEach({});
            }).to.throw(TypeError);
        });

        it('should take an optional scope object to call the processor on', function() {
            let scope = {},
                correctScopeCount = 0;
            queue.forEach(function() {
                if (scope === this)
                    correctScopeCount += 1;
            }, scope);
            expect(correctScopeCount).to.equals(4);
        });

        it(`should take an optional comma separated list of extra parameters, the parameters
        are passed inbetween the item and index parameter`, function() {
            let correctParameterCount = 0;

            queue.forEach(function(item, param1, param2) {
                if (param1 === 'hey' && param2 === 'ho')
                    correctParameterCount += 1;
            }, null, 'hey', 'ho');

            expect(correctParameterCount).to.equals(4);
        });
    });

    describe('#every(callback, scope?)', function() {
        let queue = new Queue([2, 4, 6, 8]);
        it('should return true if the callback method returns true for all items in the queue', function() {
            expect(queue.every(item => item % 2 === 0)).to.be.true;
            expect(queue.every(item => item > 1)).to.be.true;
        });

        it('should return false if any item in the queue fails the callback test condition', function() {
            queue.put(1).put(0);
            expect(queue.every(item => item % 2 === 0)).to.be.false;
            expect(queue.every(item => item > 1)).to.be.false;
        });

        it('should throw TypeError if callback is not a function', function() {
            expect(function() {
                queue.every(null);
            }).to.throw(TypeError);
        });

        it('should take an optional execution scope object as second parameter', function() {
            let scopedCallCount = 0,
                scope = {name: 'scoping'},
                queue = new Queue([1, 2, 3, 4]);

            queue.every(function() {
                if (this === scope)
                    scopedCallCount += 1;
                return true;
            }, scope);

            expect(scopedCallCount).to.equals(4);
        });

        it('should return false for all tests on empty queue', function() {
            queue.empty();
            expect(queue.every(function() {return true;})).to.be.false;
        });
    });

    describe('#some(callback, scope?)', function() {
        let queue = new Queue([2, 4, 6, 8]);
        it(`should return true if the callback method returns true for at least one item in
        the queue`, function() {
            expect(queue.some(item => item >= 8)).to.be.true;
            expect(queue.some(item => item === 2)).to.be.true;
        });

        it('should return false if callback method did not return true for any item in the queue', function() {
            expect(queue.some(item => item > 8)).to.be.false;
            expect(queue.some(item => item < 2)).to.be.false;
        });

        it('should throw TypeError if callback is not a function', function() {
            expect(function() {
                queue.some(null);
            }).to.throw(TypeError);
        });

        it('should take an optional execution scope object as second parameter', function() {
            let scopedCallCount = 0,
                scope = {name: 'scoping'},
                queue = new Queue([1, 2, 3, 4]);

            queue.some(function() {
                if (this === scope)
                    scopedCallCount += 1;
                return false;
            }, scope);

            expect(scopedCallCount).to.equals(4);
        });

        it('should return false for all tests on empty queue', function() {
            queue.empty();
            expect(queue.some(function() {return true;})).to.be.false;
        });
    });

    describe('#map(callback, scope?)', function() {
        let queue = new Queue([2, 4, 6, 8]);

        it(`should return an array with the result of calling the provided callback on
        every item in the queue`, function() {
            expect(queue.map(item => item * 2)).to.deep.equals([4, 8, 12, 16]);
            expect(queue.map(item => item * 0)).to.deep.equals([0, 0, 0, 0]);
        });

        it('should throw TypeError if callback is not a function', function() {
            expect(function() {
                queue.map(null);
            }).to.throw(TypeError);
        });

        it('should take a callback execution scope object as a second optional parameter', function() {
            let scope = {divisor: 2};
            expect(queue.map(function(item) {
                return item / this.divisor;
            }, scope)).to.deep.equals([1, 2, 3, 4]);
        });

        it('should return empty array for all calls on empty queue', function() {
            queue.empty();
            expect(queue.map(function() {return true;})).to.deep.equals([]);
        });
    });

    describe('#reduce(callback, initialValue?)', function() {
        let queue = new Queue([2, 4, 6, 8]);

        it(`should reduce the items in the queue to an accumulation by calling each item on
        the given callback.`, function() {
            expect(queue.reduce((accumulator, current) => accumulator + current)).to.equals(20);
            expect(queue.reduce((accumulator, current) => accumulator * current)).to.equals(384);

            expect(queue.reduce((accumulator, current) => accumulator + current, 20)).to.equals(40);
            expect(queue.reduce((accumulator, current) => accumulator * current, 0)).to.equals(0);
        });

        it('should throw TypeError if callback is not a function', function() {
            expect(function() {
                queue.reduce(null);
            }).to.throw(TypeError);
        });

        it('should throw TypeError if queue is empty and no initial value is provided', function() {
            queue.empty();
            expect(function() {
                queue.reduce(function(accumulator, current) {
                    return accumulator + current;
                });
            }).to.throw(TypeError);
        });
    });

    describe('#filter(callback, scope?)', function() {
        let queue = new Queue([2, 4, 6, 8]);

        it(`should filter out a new queue containing items for which the callback method
        returns true`, function() {
            let filter = queue.filter(item => item > 4); //filter all items greater than 4
            expect(filter.toArray()).to.deep.equals([6, 8]);
        });

        it(`should filter out a new queue with empty items if callback returns true for no
        item`, function() {
            let filter = queue.filter(item => item > 8); //filter all items greater than 8
            expect(filter.toArray()).to.deep.equals([]);
        });

        it('should throw error if callback is not a function', function() {
            expect(function() {
                queue.filter({});
            }).to.throw(TypeError);
        });

        it('should take an optional execution scope object as second parameter', function() {
            let scopedCallCount = 0,
                scope = {name: 'scoping'},
                queue = new Queue([1, 2, 3, 4]);

            queue.filter(function() {
                if (this === scope)
                    scopedCallCount += 1;
                return false;
            }, scope);

            expect(scopedCallCount).to.equals(4);
        });
    });
});