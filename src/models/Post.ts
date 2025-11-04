import { Schema, model, InferSchemaType } from "mongoose";


const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);


type PostType = InferSchemaType<typeof postSchema>;

const Post = model<PostType>("Post", postSchema);

export default Post;
