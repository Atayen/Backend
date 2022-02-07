const mongoose = require('mongoose');

const twitterProfileSchema = mongoose.Schema({
  
   id: { type: String},
   username:{ type: String},
   displayName: { type: String},
   photos: [
     {
       value: { type: String},
    }
  ],
   provider: { type: String},
   _raw: { type: String},
   _json: {
     id:{ type: String},
     id_str: { type: String},
     name: { type: String},
     screen_name: { type: String},
     location: { type: String},
     description:{ type: String},
     url:{ type: String},
     entities: {
       description: {
         urls: [
          
        ]
      }
    },
     protected: { type: Boolean},
     followers_count:{ type: Number},
     friends_count: { type: Number},
     listed_count:{ type: Number},
     created_at: { type: String},
     favourites_count:{ type: Number},
     utc_offset:{ type: String},
     time_zone:{ type: String},
     geo_enabled:  { type: Boolean},
     verified:  { type: Boolean},
     statuses_count:{ type: Number},
     lang: { type: String},
     status: {
       created_at: { type: String},
       id:{ type: String},
       id_str: { type: String},
       text:{ type: String},
       truncated:  { type: Boolean},
       entities: {
         hashtags: [
           {
             text: { type: String},
             indices: [
                { type: Number}
            ]
          }
        ],
         symbols: [
          
        ],
         user_mentions: [
           {
             screen_name: { type: String},
             name: { type: String},
             id: { type: String},
             id_str: { type: String},
             indices: [
                { type: Number}
            ]
          }
        ],
         urls: [
           {
             url:{ type: String},
             expanded_url: { type: String},
             display_url: { type: String},
             indices: [
                { type: Number}
            ]
          }
        ]
      },
       source: { type: String},
       in_reply_to_status_id: { type: String},
       in_reply_to_status_id_str: { type: String},
       in_reply_to_user_id:{ type: String},
       in_reply_to_user_id_str: { type: String},
       in_reply_to_screen_name: { type: String},
        geo: { type: String},
       coordinates:{ type: String},
       place: { type: String},
       contributors: { type: String},
       retweeted_status: {
         created_at: { type: String},
         id:{ type: String},
         id_str: { type: String},
         text: { type: String},
         truncated:  { type: Boolean},
         entities: {
           hashtags: [
             {
               text: { type: String},
               indices: [
                { type: Number}
              ]
            }
          ],
           symbols: [
            
          ],
           user_mentions: [
            
          ],
           urls: [
             {
               url: { type: String},
               expanded_url: { type: String},
               display_url:{ type: String},
               indices: [
                { type: Number}
              ]
            }
          ]
        },
         source: { type: String},
         in_reply_to_status_id: { type: String},
         in_reply_to_status_id_str: { type: String},
         in_reply_to_user_id: { type: String},
         in_reply_to_user_id_str: { type: String},
         in_reply_to_screen_name: { type: String},
         geo: { type: String},
         coordinates: { type: String},
         place: { type: String},
         contributors: { type: String},
         is_quote_status:  { type: Boolean},
         retweet_count: { type: Number},
         favorite_count: { type: Number},
         favorited:  { type: Boolean},
         retweeted: { type: Boolean},
         possibly_sensitive:  { type: Boolean},
         lang: { type: String},
      },
        is_quote_status:  { type: Boolean},
       retweet_count: { type: Number},
       favorite_count:{ type: Number},
       favorited: { type: Boolean},
       retweeted: { type: Boolean},
       possibly_sensitive: { type: Boolean},
       lang:{ type: String},
    },
     contributors_enabled:  { type: Boolean},
     is_translator:  { type: Boolean},
     is_translation_enabled: { type: Boolean},
     profile_background_color: { type: String},
     profile_background_image_url: { type: String},
     profile_background_image_url_https: { type: String},
     profile_background_tile:  { type: Boolean},
     profile_image_url: { type: String},
     profile_image_url_https: { type: String},
     profile_banner_url: { type: String},
     profile_link_color: { type: String},
     profile_sidebar_border_color: { type: String},
     profile_sidebar_fill_color: { type: String},
     profile_text_color: { type: String},
     profile_use_background_image:  { type: Boolean},
     has_extended_profile: { type: Boolean},
     default_profile:  { type: Boolean},
     default_profile_image:  { type: Boolean},
     following:  { type: Boolean},
     follow_request_sent:  { type: Boolean},
     notifications: { type: Boolean},
     translator_type: { type: String},
     withheld_in_countries: [
      
    ],
     suspended:  { type: Boolean},
     needs_phone_verification: { type: Boolean},
  },
   _accessLevel: { type: String},
   access_token_key:{ type: String},
   access_token_secret:{ type: String},
   UserId:{ type: Number, required: true,  ref: 'sn_users' },
   subscibers:{ type: Number},
   twitter_id: { type: String},
}

   
)

const TwitterProfile = mongoose.model("twitter_profile", twitterProfileSchema);