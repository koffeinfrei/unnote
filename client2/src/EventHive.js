// credits to https://davidwalsh.name/pubsub-javascript
class EventHive {
  static get topics() {
    if (typeof this._topics === 'undefined') {
      this._topics = {};
    }
    return this._topics;
  }

  static subscribe(topic, listener) {
    // Create the topic's object if not yet created
    if (!this.topics.hasOwnProperty.call(this.topics, topic)) {
      this.topics[topic] = [];
    }

    // Add the listener to queue
    var index = this.topics[topic].push(listener) -1;

    // Provide handle back for removal of topic
    return {
      remove: () => {
        delete this.topics[topic][index];
      }
    };
  }

  static publish(topic, info) {
    // If the topic doesn't exist, or there's no listeners in queue, just leave
    if (!this.topics.hasOwnProperty.call(this.topics, topic)) {
      return;
    }

    // Cycle through topics queue, fire!
    this.topics[topic].forEach(function(item) {
      item(info !== undefined ? info : {});
    });
  }
}

export default EventHive;
