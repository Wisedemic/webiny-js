// @flow
import * as React from "react";
import { DelayedOnChange } from "webiny-app-cms/editor/components/DelayedOnChange";
import { Grid, Cell } from "webiny-ui/Grid";
import { Input } from "webiny-ui/Input";
import OpenGraphTags from "./OpenGraphTags";
import PageImage from "./PageImage";
import appendOgImageDimensions from "./appendOgImageDimensions";

const SocialSettings = ({ Bind, form }: Object) => {
    return (
        <React.Fragment>
            <Grid>
                <Cell span={12}>
                    <Bind name={"settings.social.title"}>
                        <DelayedOnChange>
                            <Input
                                label="Title (leave blank to use your page title)"
                                description="Social media title (og:title)."
                            />
                        </DelayedOnChange>
                    </Bind>
                </Cell>
            </Grid>
            <Grid>
                <Cell span={12}>
                    <Bind name={"settings.social.description"}>
                        <DelayedOnChange>
                            <Input
                                label="Description (leave blank to use your page snippet)"
                                description="Social media description (og:description)."
                            />
                        </DelayedOnChange>
                    </Bind>
                </Cell>
            </Grid>

            <Grid>
                <Cell span={12}>
                    <Bind
                        name={"settings.social.image"}
                        afterChange={value => appendOgImageDimensions({ value, form })}
                    >
                        <PageImage
                            label="Social Image"
                            description={`Linked via "og:image" tag. Recommended resolution 1596x545.`}
                            imageEditor={{
                                crop: {
                                    autoEnable: true,
                                    aspectRatio: 1596 / 545
                                }
                            }}
                        />
                    </Bind>
                </Cell>
            </Grid>

            <Bind name={"settings.social.meta"} defaultValue={[]}>
                {props => <OpenGraphTags prefix={"settings.social.meta"} Bind={Bind} {...props} />}
            </Bind>
        </React.Fragment>
    );
};

export default SocialSettings;
