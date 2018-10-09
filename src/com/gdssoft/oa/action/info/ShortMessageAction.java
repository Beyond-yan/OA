package com.gdssoft.oa.action.info;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.info.InMessage;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.info.InMessageService;
import com.gdssoft.oa.service.info.ShortMessageService;
import com.gdssoft.oa.service.system.AppUserService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;

public class ShortMessageAction extends BaseAction {

	static short NOT_DELETE=(short)0;
	private ShortMessage shortMessage;
    private Date from;
    private Date to;
	private List<InMessage> inList=new ArrayList<InMessage>();
	
	public List<InMessage> getInList() {
		return inList;
	}

	public void setInList(List<InMessage> inList) {
		this.inList = inList;
	}

	public Date getFrom() {
		return from;
	}

	public void setFrom(Date from) {
		this.from = from;
	}

	public Date getTo() {
		return to;
	}

	public void setTo(Date to) {
		this.to = to;
	}

	public ShortMessage getShortMessage() {
		return shortMessage;
	}

	public void setShortMessage(ShortMessage shortMessage) {
		this.shortMessage = shortMessage;
	}
	
	@Resource
	private ShortMessageService shortMessageService;
	@Resource
	private InMessageService inMessageService;
	@Resource
	private AppUserService appUserService;
	
	/**
	 * 发送列表
	 */
	@SuppressWarnings("unchecked")
	public String list(){
		List<Object[]> list;
		PagingBean pb=getInitPagingBean();
		AppUser appUser=ContextUtil.getCurrentUser();
		list=shortMessageService.searchShortMessage(appUser.getUserId(), shortMessage, from, to, pb);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':"+pb.getTotalItems()+",result:");
		List<InMessage> inList=new ArrayList<InMessage>();
		for(int i=0;i<list.size();i++){
		    InMessage inMessage=(InMessage)list.get(i)[0];
		    inList.add(inMessage);
	    }
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
	    Type type=new TypeToken<List<InMessage>>(){}.getType();
	    buff.append(gson.toJson(inList,type));
		buff.append("}");
		setJsonString(buff.toString());
	    return SUCCESS;
	}
	
	/**
	 * 发送
	 * @return
	 */
	public String send(){
		String reId=getRequest().getParameter("userId");
		String content=getRequest().getParameter("content");
		String senderId=getRequest().getParameter("senderId");
		
		AppUser appUser=ContextUtil.getCurrentUser();
		if(StringUtils.isNotEmpty(reId)&&StringUtils.isNotEmpty(content)){
			String st[]=reId.split(",");
			ShortMessage message=new ShortMessage();
			message.setContent(content);
			message.setMsgType((short)1);
			if(StringUtils.isNotEmpty(senderId)&&StringUtil.isNum(senderId)){
				AppUser sender=appUserService.get(new Long(senderId));
				message.setSender(sender.getFullname());
				message.setSenderId(sender.getUserId());
			}else{
				message.setSenderId(appUser.getUserId());
				message.setSender(appUser.getFullname());
			}
			message.setSendTime(new Date());
			shortMessageService.save(message);
			for(int i=0;i<st.length;i++){
				InMessage in=new InMessage();	
				in.setUserId(Long.parseLong(st[i]));
				AppUser user=appUserService.get(Long.parseLong(st[i]));
				in.setUserFullname(user.getFullname());
				in.setDelFlag(NOT_DELETE);
				in.setReadFlag((short)0);
				in.setShortMessage(message);
				inMessageService.save(in);
			}						
			setJsonString("{success:true}");
		}else{
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}
	

}
