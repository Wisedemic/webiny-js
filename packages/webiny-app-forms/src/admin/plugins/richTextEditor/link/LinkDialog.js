import React, { Fragment } from "react";
import { compose, withProps, withHandlers } from "recompose";
import { Form } from "webiny-form";
import { Input } from "webiny-ui/Input";
import { Switch } from "webiny-ui/Switch";
import { Cell, Grid } from "webiny-ui/Grid";
import {
    Dialog,
    DialogBody,
    DialogHeader,
    DialogHeaderTitle,
    DialogCancel,
    DialogFooter,
    DialogFooterButton
} from "webiny-ui/Dialog";
import { getLinkRange, isLink, TYPE } from "./utils";

const LinkDialog = ({ open, linkData, updateLink, closeDialog }) => {
    return (
        <Dialog open={open} onClose={closeDialog}>
            <Form data={linkData} onSubmit={updateLink}>
                {({ Bind, submit }) => (
                    <Fragment>
                        <DialogHeader>
                            <DialogHeaderTitle>Edit Link</DialogHeaderTitle>
                        </DialogHeader>
                        <DialogBody>
                            <Grid>
                                <Cell span={12}>
                                    <Bind name={"text"} validators={["required"]}>
                                        <Input label="Text to display" />
                                    </Bind>
                                </Cell>
                                <Cell span={12}>
                                    <Bind name={"href"} validators={["required"]}>
                                        <Input label="URL" />
                                    </Bind>
                                </Cell>
                                <Cell span={6}>
                                    <Bind name={"newTab"}>
                                        <Switch
                                            onChange={() => submit()}
                                            label={"Open in new window"}
                                        />
                                    </Bind>
                                </Cell>
                                <Cell span={6}>
                                    <Bind name={"noFollow"}>
                                        <Switch
                                            onChange={() => submit()}
                                            label={`Add "rel=nofollow"`}
                                        />
                                    </Bind>
                                </Cell>
                            </Grid>
                        </DialogBody>
                        <DialogFooter>
                            <DialogCancel onClick={closeDialog}>Cancel</DialogCancel>
                            <DialogFooterButton onClick={submit}>OK</DialogFooterButton>
                        </DialogFooter>
                    </Fragment>
                )}
            </Form>
        </Dialog>
    );
};

export default compose(
    withProps(({ value }) => {
        if (!value) {
            return { linkData: null };
        }

        const { selection, inlines, anchorText } = value;
        let link = inlines.some(isLink) && inlines.find(isLink);

        const selectedText = anchorText.substr(
            selection.anchor.offset,
            selection.focus.offset - selection.anchor.offset
        );

        return { linkData: (link && link.data) || { text: selectedText } };
    }),
    withHandlers({
        updateLink: ({ editor, onChange, closeDialog, value: { selection } }) => data => {
            editor.change(change => {
                const linkSelection = getLinkRange(change, selection);
                change
                    .select(linkSelection)
                    .unwrapInline(TYPE)
                    .insertText(data.text)
                    .moveAnchorBackward(data.text.length)
                    .wrapInline({ type: TYPE, data })
                    .moveToEnd();

                onChange(change);
                closeDialog();
            });
        }
    })
)(LinkDialog);