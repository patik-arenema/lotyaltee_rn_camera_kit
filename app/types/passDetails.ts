export type StampConfigType = {
  no_of_stamps: number;
  background_color: string;
  label_color: string;
  stamp_shape: 'square' | 'circle' | string; // adjust if you have fixed options
  stamp_fill_color: string;
  stamp_text_color: string;
};

export type StoreDetailsType = {
  store_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  store_image_url: string;
  contact_number: string;
  email: string | null;
  store_website_url: string;
  stamp_config: StampConfigType;
};

export type StampsDetailsType = {
  status: string,
  card_uuid:string,
  stamps_count: number,
  pending_redeem: number
  user_id: string 
  store_id:string
}