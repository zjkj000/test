package com.navigationdemo.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.navigationdemo.R;
import com.tencent.teduboard.TEduBoardController;

import java.util.List;

            //切换资源时候用到的
public class ChooseFileRecyclerViewAdapter extends RecyclerView.Adapter<MyViewHoder>{
    private List<TEduBoardController.TEduBoardFileInfo> data;

                public void setData(List<TEduBoardController.TEduBoardFileInfo> data) {
                    this.data = data;
                }

                private Context context;

                public String getCurFileId() {
                    return curFileId;
                }

                private String curFileId;


    public void setCurFileId(String curFileId) {
        this.curFileId = curFileId;
    }

    private ChooseFileRecyclerViewAdapter.OnSwitchFileClickListener mOnSwitchFileClickListener;



    public interface OnSwitchFileClickListener {
        void onSwitchFileClick(TEduBoardController.TEduBoardFileInfo item);
        void onDelectFileCilck(TEduBoardController.TEduBoardFileInfo item);
    }
    public void setOnSwitchFileClickListener(ChooseFileRecyclerViewAdapter.OnSwitchFileClickListener mOnSwitchFileClickListener) {
        this.mOnSwitchFileClickListener = mOnSwitchFileClickListener;
    }


    public ChooseFileRecyclerViewAdapter(List<TEduBoardController.TEduBoardFileInfo> data, Context context, String curFileId) {
        this.data = data;
        this.context = context;
        this.curFileId  =curFileId;
    }
    public ChooseFileRecyclerViewAdapter() {
    }

    @NonNull
    @Override
    public MyViewHoder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = View.inflate(context.getApplicationContext(), R.layout.chooseboardfileresources_item, null);
        MyViewHoder myViewHoder = new MyViewHoder(view);
        return myViewHoder;
    }
    @SuppressLint("ResourceAsColor")
    @Override
    public void onBindViewHolder(@NonNull MyViewHoder holder, @SuppressLint("RecyclerView") int position) {
        TEduBoardController.TEduBoardFileInfo mdata = data.get(position);
        holder.mTitle.setText(mdata.getTitle());
        if(mdata.getTitle().endsWith("ppt")||mdata.getTitle().endsWith("pptx")){
            holder.mImg.setImageResource(R.mipmap.file_ppt);
        }else if(mdata.getTitle().endsWith("doc")||mdata.getTitle().endsWith("docx")){
            holder.mImg.setImageResource(R.mipmap.file_word);
        }else if(mdata.getTitle().endsWith("pdf")){
            holder.mImg.setImageResource(R.mipmap.file_pdf);
        }else if(mdata.getTitle().endsWith("mp4")){
            holder.mImg.setImageResource(R.mipmap.file_mp4);
        }
        if(mdata.fileId.equals(curFileId)){
            holder.fileRL.setBackgroundResource(R.drawable.fileitembg_ed);
        }
        holder.fileitemLinerLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mOnSwitchFileClickListener.onSwitchFileClick(mdata);
            }
        });
        holder.closefile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("+++要删除的文件ID"+mdata.getFileId());
                mOnSwitchFileClickListener.onDelectFileCilck(mdata);
            }
        });
    }
    @Override
    public int getItemCount() {
        return data.size()>0?data.size():0;
    }
}

class MyViewHoder extends RecyclerView.ViewHolder {
    TextView mTitle;
    ImageView mImg;
    RelativeLayout fileRL;
    LinearLayout fileitemLinerLayout;
    ImageView closefile;
    public MyViewHoder(@NonNull View itemView) {
        super(itemView);
        mTitle = itemView.findViewById(R.id.filetitle);
        mImg = itemView.findViewById(R.id.filetype);
        fileRL = itemView.findViewById(R.id.fillitemRl);
        closefile = itemView.findViewById(R.id.closefileItem);
        fileitemLinerLayout=itemView.findViewById(R.id.fileitemLinerLayout);
    }
}