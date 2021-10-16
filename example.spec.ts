/* istanbul ignore file */
class FriendList {
    friends = [];

    addFriend(name) {
        this.friends.push(name);
        this.announceFriendship(name);
    }

    announceFriendship(name) {
        console.log(`${name} is now a friend!`);
    }

    removeFriend(name) {
        const idx = this.friends.indexOf(name);
        if (idx === -1) {
            throw new Error('Friend not found!');
        }

        this.friends.splice(idx, 1);
    }
}

// Test
describe('FriendList', () => {
    let friendList;

    beforeEach(() => {
        friendList = new FriendList();
    });

    it('initializes friends list', () => {
        expect(friendList.friends.length).toEqual(0);
    });

    it('adds a friend to the list', () => {
        friendList.addFriend('sam');
        expect(friendList.friends.length).toEqual(1);
    });

    it('announces friendship', () => {
        friendList.announceFriendship = jest.fn();

        expect(friendList.announceFriendship).not.toHaveBeenCalled();
        friendList.addFriend('pratama');
        expect(friendList.announceFriendship).toHaveBeenCalledWith('pratama');
    });

    describe('removeFriend', () => {
        it('removes friend from friendlist', () => {
            friendList.addFriend('sam');
            expect(friendList.friends[0]).toEqual('sam');
            friendList.removeFriend('sam');
            expect(friendList.friends[0]).toBeUndefined();
        });

        it('throws an error as friend does not exist', () => {
            expect(() => friendList.removeFriend('sam')).toThrow();
        });
    });
});
