import Uuid from './Uuid';

class Note {
  constructor(uid, title, content, tasks, createdAt, updatedAt, archivedAt) {
    this._uid = uid || Uuid.generateV4();
    this._title = title || '';
    this._content = content || '';
    this._hasTasks = (tasks || []).length > 0;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || this._createdAt;
    this._serverUpdatedAt = this._updatedAt;
    this._archivedAt = archivedAt;
  }

  get uid() { return this._uid }

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
  get updatedAt() { return this._updatedAt }

  get serverUpdatedAt() { return this._serverUpdatedAt }
  set serverUpdatedAt(serverUpdatedAt) { this._serverUpdatedAt = serverUpdatedAt }

  get archivedAt() { return this._archivedAt; }

  setArchived() {
    this._archivedAt = new Date();
  }

  isNew() {
    return !this.title && !this.content;
  }

  hasTasks() {
    return this._hasTasks;
  }

  toJson() {
    return JSON.stringify(
      {
        uid: this.uid,
        title: this.title,
        content: this.content,
        created_at: this.createdAt.toISOString(),
        updated_at: this.updatedAt.toISOString(),
        server_updated_at: this.serverUpdatedAt.toISOString(),
        archived_at: this.archivedAt ? this.archivedAt.toISOString() : null
      }
    );
  }

  static fromAttributes(attributes) {
    if (!attributes) return;

    return new Note(
      attributes.uid,
      attributes.title,
      attributes.content,
      attributes.tasks,
      new Date(attributes.created_at),
      new Date(attributes.updated_at),
      attributes.archived_at ? new Date(attributes.archived_at) : null
    );
  }
}

export default Note;
