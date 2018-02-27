// @flow
import _ from "lodash";
import {
    EntitiesAttribute,
    type EntityAttributesContainer,
    type EntityCollection
} from "webiny-entity";
import { File } from "./../index";
import type { Storage } from "webiny-file-storage";

class FilesAttribute extends EntitiesAttribute {
    storage: Storage;
    storageFolder: string;
    tags: Array<string>;

    constructor(name: string, attributesContainer: EntityAttributesContainer) {
        super(name, attributesContainer, File, "ref");
    }

    /**
     * Set tags that will always be assigned to the file
     *
     * @param tags
     *
     * @return this
     */
    setTags(tags: Array<string> = []): FilesAttribute {
        this.tags = tags;

        return this;
    }

    /**
     * Set storage to use with this attribute
     *
     * @param {Storage} storage
     *
     * @return this
     */
    setStorage(storage: Storage): FilesAttribute {
        this.storage = storage;

        return this;
    }

    /**
     * Set folder in which the file will be stored (relative to the root of your storage)
     *
     * @param {string} folder
     *
     * @return this
     */
    setFolder(folder: string): FilesAttribute {
        this.storageFolder = folder;

        return this;
    }

    async getValue() {
        let values = await EntitiesAttribute.prototype.getValue.call(this);
        values.map(value => {
            if (value instanceof this.getEntitiesClass()) {
                if (this.storage) {
                    value.setStorage(this.storage).setStorageFolder(this.storageFolder);
                }
            }
        });

        return values;
    }

    // $FlowIgnore
    async setValue(value: Array<{}> | EntityCollection): Promise<void> {
        await EntitiesAttribute.prototype.setValue.call(this, value);
        const values = await this.getValue();

        values.map(value => {
            if (value instanceof this.getEntitiesClass()) {
                value.tags = _.uniqWith(this.tags.concat(value.tags), _.isEqual);
                if (this.storage) {
                    value.setStorage(this.storage).setStorageFolder(this.storageFolder);
                }
            }
        });

        return this;
    }
}

export default FilesAttribute;