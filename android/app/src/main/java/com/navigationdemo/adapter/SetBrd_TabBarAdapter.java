package com.navigationdemo.adapter;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import java.util.List;
import java.util.Random;

public class SetBrd_TabBarAdapter extends FragmentPagerAdapter {

    private String[] mTitles = new String[]{};
    public String[] getmTitles() {
        return mTitles;
    }
    public void setmTitles(String[] mTitles) {
        this.mTitles = mTitles;
    }

    private int IntRandom=1;
    private List<Fragment> mFragment;
    public List<Fragment> getmFragment() {
        return mFragment;
    }
    public void setmFragment(List<Fragment> mFragment) {
        this.mFragment = mFragment;
    }

    private long baseId = 0;

    public SetBrd_TabBarAdapter(@NonNull FragmentManager fm) {
        super(fm);
    }


    @Override
    public long getItemId(int position) {
        return baseId + position;
    }



    @NonNull
    @Override
    public Fragment getItem(int position) {
        return mFragment.get(position);
    }

    public void changeId() {
        Random random=new Random();
        baseId += getCount() + random.nextInt(100000);
    }


    @Override
    public int getCount() {
        return mFragment.size();
    }

    @Override
    public CharSequence getPageTitle(int position) {
        return mTitles[position];
    }
}
