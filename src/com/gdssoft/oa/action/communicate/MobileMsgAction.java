package com.gdssoft.oa.action.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.communicate.MobileMsg;
import com.gdssoft.oa.service.communicate.MobileMsgService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author 
 *
 */
public class MobileMsgAction extends BaseAction{
	@Resource
	private MobileMsgService mobileMsgService;
	private MobileMsg mobileMsg;
	
	private Long msgId;

	public Long getMsgId() {
		return msgId;
	}

	public void setMsgId(Long msgId) {
		this.msgId = msgId;
	}

	public MobileMsg getMobileMsg() {
		return mobileMsg;
	}

	public void setMobileMsg(MobileMsg mobileMsg) {
		this.mobileMsg = mobileMsg;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<MobileMsg> list= mobileMsgService.getAll(filter);
		
		Type type=new TypeToken<List<MobileMsg>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				mobileMsgService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		MobileMsg mobileMsg=mobileMsgService.get(msgId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(mobileMsg));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		mobileMsgService.save(mobileMsg);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
