package com.navigationdemo;

import android.app.Activity;
import android.content.Intent;
import android.text.TextUtils;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MyIntentModule extends ReactContextBaseJavaModule {
    public MyIntentModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "IntentMoudle";
    }
    //注意：记住getName方法中的命名名称，JS中调用需要

    @ReactMethod
    public void startActivityFromJS(String name, String params){

        System.out.println("startActivityFromJS-params:"+params);
        //console.log("pa:",params);
        try{
            //System.out.println("startActivityFromJS-params:"+params);
            Activity currentActivity = getCurrentActivity();
            if(null!=currentActivity){
                //Class toActivity = Class.forName("com.navigationdemo."+name);
                Class toActivity = Class.forName("com.navigationdemo."+name);
                Intent intent = new Intent(currentActivity,toActivity);
                intent.putExtra("params", params);
                currentActivity.startActivity(intent);
            }
        }catch(Exception e){
            throw new JSApplicationIllegalArgumentException(
                    "不能打开Activity : "+e.getMessage());
        }
    }

    @ReactMethod
    public void dataToJS(Callback successBack, Callback errorBack){
        try{
            Activity currentActivity = getCurrentActivity();
            String result = currentActivity.getIntent().getStringExtra("data");
            if (TextUtils.isEmpty(result)){
                result = "没有数据";
            }
            successBack.invoke(result);
        }catch (Exception e){
            errorBack.invoke(e.getMessage());
        }
    }
}
