package com.gdssoft.oa.action.info;

/*
* 捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.info.InMessage;
import com.gdssoft.oa.model.info.ShortMessage;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.info.InMessageService;
import com.gdssoft.oa.service.info.ShortMessageService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;

public class InMessageAction extends BaseAction {

	static short HAVE_DELETE=(short)1;
	private InMessage inMessage;
    private ShortMessage shortMessage;
    private Date from;
    private Date to;
    
	public InMessage getInMessage() {
		return inMessage;
	}

	public void setInMessage(InMessage inMessage) {
		this.inMessage = inMessage;
	}	
	public ShortMessage getShortMessage() {
		return shortMessage;
	}

	public void setShortMessage(ShortMessage shortMessage) {
		this.shortMessage = shortMessage;
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
	@Resource
	private InMessageService inMessageService;
	@Resource
	private ShortMessageService shortMessageService;
	
	/**
	 * 收信息列表
	 */
	public String list(){
		List<Object[]> list;
		PagingBean pb=getInitPagingBean();
		AppUser appUser=ContextUtil.getCurrentUser();
//		if(inMessage!=null){
		  list=inMessageService.searchInMessage(appUser.getUserId(), inMessage, shortMessage, from, to, pb);
//		}else{
//		  list=inMessageService.findByUser(appUser.getUserId(),pb);	
//		}
		List<InMessage> inList=new ArrayList<InMessage>();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':"+pb.getTotalItems()+",result:");
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
	 * 读信息
	 * @return
	 */
	public String know(){
		String strReceiveId=getRequest().getParameter("receiveId");
		Long receiveId=null;
		if(StringUtils.isNotEmpty(strReceiveId)){
			receiveId=Long.parseLong(strReceiveId);
		}		
		InMessage in=inMessageService.get(receiveId);
		in.setReadFlag((short)1);  //1标志为读
		inMessageService.save(in);
        setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 单个或多个删除
	 * @return
	 */
	public String multiRemove(){
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				inMessage=inMessageService.get(Long.parseLong(id));
				inMessage.setDelFlag(HAVE_DELETE);
				inMessageService.save(inMessage);
			}
		}		
		jsonString="{success:true}";
		return SUCCESS;
	}
	
	/**
	 * 回复
	 * @return
	 */
	public String reply(){
		String strReplyId=getRequest().getParameter("receiveId");
		if(StringUtils.isNotEmpty(strReplyId)){
			Long replyId=Long.parseLong(strReplyId);
			inMessage=inMessageService.get(replyId);
			StringBuffer buff = new StringBuffer("{success:true,data:[");
			buff.append("{'messageId':"+inMessage.getShortMessage().getMessageId()+",'senderId':'"+inMessage.getShortMessage().getSenderId()+"','sender':'"+inMessage.getShortMessage().getSender()+"'}").append("]}");
			setJsonString(buff.toString());
		}
		else setJsonString("{success:false}");
		
		return SUCCESS;
	}
	
	/**
	 * 点击阅读
	 * @return
	 */
	public String read(){
		Long userId=ContextUtil.getCurrentUser().getUserId();
		boolean flag=false;
		if(userId!=null){
			inMessage=inMessageService.findByRead(userId);
			if(inMessage==null){
				flag=true;
				inMessage=inMessageService.findLatest(userId);
			}
			if(inMessage!=null){
				inMessage.setReadFlag(InMessage.FLAG_READ);
				inMessageService.save(inMessage);
				shortMessage=inMessage.getShortMessage();
				SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				String date=sdf.format(shortMessage.getSendTime());
				StringBuffer buff=new StringBuffer("{success:true,message:");
				buff.append("{'receiveId':"+inMessage.getReceiveId()+",'messageId':"+shortMessage.getMessageId()+",'senderId':"+shortMessage.getSenderId()+",'sender':'"+shortMessage.getSender()+"','content':'"+shortMessage.getContent().replace("\n", " ")+"','sendTime':'"+date+"','msgType':"+shortMessage.getMsgType());
				if(!flag){
					InMessage in=inMessageService.findByRead(userId);
					if(in!=null){
						buff.append(",haveNext:true");
					}else{
						buff.append(",haveNext:false");
					}
				}else{
					buff.append(",haveNext:false");
				}
				buff.append("}}");
				setJsonString(buff.toString());
			}else{
				setJsonString("{success:false}");
			}
		}else{
			setJsonString("{success:true}");
		}
		return SUCCESS;
	}
	
	public String count(){
		Integer in=inMessageService.findByReadFlag(ContextUtil.getCurrentUser().getUserId());
		setJsonString("{success:true,count:'"+in+"'}");
		return SUCCESS;
	}	
	
	/**
	 * 首页读取详细信息内容
	 * 
	 * 
	 */
	public String detail(){
		String strReceiveId=getRequest().getParameter("receiveId");
		if(StringUtils.isNotEmpty(strReceiveId)){
			Long receiveId=new Long(strReceiveId);
			inMessage=inMessageService.get(receiveId);
			inMessage.setReadFlag((short)1);  //标识为已读
			inMessageService.save(inMessage);
		}
		return "detail";
	}
	
	/**
	 * 首页显示信息列表
	 */
	public String display(){
		List<Object[]> list;
		PagingBean pb=new PagingBean(0,8);
		AppUser appUser=ContextUtil.getCurrentUser();
		  list=shortMessageService.searchShortMessage(appUser.getUserId(), null, null,null, pb);
		List<InMessage> inList=new ArrayList<InMessage>();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':"+pb.getTotalItems()+",result:");
		for(int i=0;i<list.size();i++){
			    InMessage inMessage=(InMessage)list.get(i)[0];
			    inList.add(inMessage);
		}
		
		getRequest().setAttribute("messageList",inList);
		return "display";
	}
	
	public String multiRead(){
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				inMessage=inMessageService.get(Long.parseLong(id));
				inMessage.setReadFlag(InMessage.FLAG_READ);
				inMessageService.save(inMessage);
			}
		}		
		jsonString="{success:true}";
		return SUCCESS;
	}
	
}
