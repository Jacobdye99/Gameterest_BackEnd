import mongoose from 'mongoose'

const commentSchema = mongoose.Schema(
    {
        game: { type: String, required: true, trim: true},
        comment: { type: String, required: true, trim: true},
        likes: { type: Number, required: true, trim: true}
    },
    { timestamps: true }
);

const favoriteSchema = mongoose.Schema(
    {
        gameId: { type: String, required: true, trim: true},
        name: { type: String, required: true, trim: true},
        image: { type: String, required: true, trim: true},
    }
)


const userSchema = mongoose.Schema(
    {
        userName: { type: String, required: true, trim: true},
        firstName: { type: String, required: true, trim: true},
        lastName: { type: String, required: true, trim: true},
        email: { type: String, required: true, trim: true},
        password: {type: String, required: true, trim: true},
        confirmPassword: { type: String, required: true, trim: true},
        avatar: { type: String, required: true, trim: true},
        comments: [commentSchema],
        favorites: [favoriteSchema],
        isAdmin: false,
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema,"users")
export const Comment = mongoose.model("Comment", commentSchema,"comments")
export const Favorite = mongoose.model("Favorite", favoriteSchema, "favorites")
