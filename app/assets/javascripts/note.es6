class Note {
  constructor(uid, title, content, createdAt, updatedAt) {
    this._uid = uid || Uuid.generateV4();
    this._title = title || '';
    this._content = content || '';
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || this._createdAt;
  }

  get uid() { return this._uid }
  set uid(uid) { this._uid = uid }

  get title() { return this._title }
  set title(title) {
    this._updatedAt = new Date();
    this._title = title;
  }

  get content() { return this._content }
  set content(content) {
    this._updatedAt = new Date();
    this._content = content;
  }

  get createdAt() { return this._createdAt }
  set createdAt(updatedAt) { this._createdAt = createdAt }

  get updatedAt() { return this._updatedAt }
  set updatedAt(updatedAt) { this._updatedAt = updatedAt }

  isNew() {
    return !this.title && !this.content;
  }

  toJson() {
    return JSON.stringify(
      {
        uid: this.uid,
        title: this.title,
        content: this.content,
        created_at: this.createdAt.toISOString(),
        updated_at: this.updatedAt.toISOString()
      }
    );
  }

  static fromAttributes(attributes) {
    return new Note(
      attributes.uid,
      attributes.title,
      attributes.content,
      new Date(attributes.created_at),
      new Date(attributes.updated_at)
    );
  }
}
