class Note {
  constructor(uid, title, content, updatedAt) {
    this._uid = uid || Uuid.generateV4();
    this._title = title || '';
    this._content = content || '';
    this._updatedAt = updatedAt;
  }

  get uid() { return this._uid }
  set uid(uid) { this._uid = uid }

  get title() { return this._title }
  set title(title) { this._title = title }

  get content() { return this._content }
  set content(content) { this._content = content }

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
        updated_at: this.updatedAt
      }
    );
  }

  static fromAttributes(attributes) {
    return new Note(
      attributes.uid,
      attributes.title,
      attributes.content,
      attributes.updated_at
    );
  }
}
