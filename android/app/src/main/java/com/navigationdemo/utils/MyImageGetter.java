package com.navigationdemo.utils;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LevelListDrawable;
import android.text.Html;
import android.util.Log;
import android.widget.TextView;

import androidx.annotation.Nullable;

import com.navigationdemo.R;
import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.bumptech.glide.request.target.SimpleTarget;
import com.bumptech.glide.request.transition.Transition;


/**
 * 显示html里面的图片
 */
public class MyImageGetter implements Html.ImageGetter {
    private static final String TAG = "MyImageGetter";
    private TextView textView;
    private Context context;

    public MyImageGetter(Context context, TextView textView) {
        this.textView = textView;
        this.context = context;
    }

    @Override
    public Drawable getDrawable(final String source) {
        //在getDrawable中的source就是 img标签里src的值也就是图片的路径
        Log.e(TAG, source);
        LevelListDrawable drawable = new LevelListDrawable();//等级列表图片
        SimpleTarget<Bitmap> simpleTarget = new SimpleTarget<Bitmap>() {

            @Override
            public void onResourceReady(Bitmap bitmap, Transition<? super Bitmap> transition) {
                if (bitmap != null) {
                    BitmapDrawable bitmapDrawable = new BitmapDrawable(context.getResources(), bitmap);
                    drawable.addLevel(1, 1, bitmapDrawable);
                    drawable.setBounds(0, 0, bitmap.getWidth(), bitmap.getHeight());
                    drawable.setLevel(1);
                    textView.invalidate();
                    textView.setText(textView.getText());//解决图文重叠
                }
            }

            @Override
            public void onLoadFailed(@Nullable Drawable errorDrawable) {
                super.onLoadFailed(errorDrawable);

            }
        };
        RequestOptions options = new RequestOptions()
                .placeholder(context.getResources().getDrawable(R.mipmap.error_img))//占位图片
                .error(context.getResources().getDrawable(R.mipmap.error_img))//错误图片
                .fallback(context.getResources().getDrawable(R.mipmap.error_img));

        Glide.with(context)
                .asBitmap()
                .load(source)
                .apply(options)
//                .override(400, 400)//压缩图片
                .into(simpleTarget);
        return drawable;
    }
}
