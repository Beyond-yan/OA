package com.gdssoft.oa.action.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.communicate.SmsHistory;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.service.communicate.SmsHistoryService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.google.gson.Gson;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class SmsHistoryAction extends BaseAction{
	@Resource
	private SmsHistoryService smsHistoryService;
	@Resource
	private SmsMobileService smsMobileService;
	private SmsHistory smsHistory;
	
	private Long smsId;

	public Long getSmsId() {
		return smsId;
	}

	public void setSmsId(Long smsId) {
		this.smsId = smsId;
	}

	public SmsHistory getSmsHistory() {
		return smsHistory;
	}

	public void setSmsHistory(SmsHistory smsHistory) {
		this.smsHistory = smsHistory;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		String status = getRequest().getParameter("status");
		String depIds = getRequest().getParameter("depName");
		String teamIds = getRequest().getParameter("teamName");
		String recipients = getRequest().getParameter("recipients");
		String phoneNumber = getRequest().getParameter("phoneNumber");
		String sendtimes = getRequest().getParameter("sendTime");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int size = Integer.parseInt(getRequest().getParameter("limit"));
		List list = null;
		Long depId = null;
		Long teamId = null;
		Long count = null;
		Date sendtime = null;
		if(null != sendtimes && "" != sendtimes.trim()){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			try {
				sendtime = sdf.parse(sendtimes);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if(null != depIds && "" != depIds.trim()) depId = new Long(depIds);
		if(null != teamIds && "" != teamIds.trim()) teamId = new Long(teamIds);
		QueryFilter filter=new QueryFilter(getRequest());
		/*if(StringUtils.isNotEmpty(status) && status.equals(SmsMobile.STATUS_NOT_SENDED.toString())){
			 list = smsMobileService.findByDepAndTeam(depId, teamId, start, size, sendtime, recipients, phoneNumber,ContextUtil.getCurrentUserId());
			 count = smsMobileService.count(depId, teamId, sendtime, recipients, phoneNumber,ContextUtil.getCurrentUserId());
		}else{
			list = smsHistoryService.findByDepAndTeam(depId, teamId, start, size, sendtime, recipients, phoneNumber,ContextUtil.getCurrentUserId());
			count = smsHistoryService.count(depId, teamId, sendtime, recipients, phoneNumber,ContextUtil.getCurrentUserId());
//			 list= smsHistoryService.getAll(filter);
			
		}*/
System.out.println("1".equals(status));
System.out.println(status == "1");
		if("1".equals(status)){
			list = smsHistoryService.findByDepAndTeam(depId, teamId, start, size, sendtime, recipients, phoneNumber,ContextUtil.getCurrentUserId());
			count = smsHistoryService.count(depId, teamId, sendtime, recipients, phoneNumber,ContextUtil.getCurrentUserId());
//			 list= smsHistoryService.getAll(filter);
		}else if("0".equals(status)){
			 list = smsMobileService.findByDepAndTeam(depId, teamId, start, size, sendtime, recipients, phoneNumber,ContextUtil.getCurrentUserId());
			 count = smsMobileService.count(depId, teamId, sendtime, recipients, phoneNumber,ContextUtil.getCurrentUserId());
		}else{
			list = smsHistoryService.findByDepAndTeamAll(depId, teamId, start, size, sendtime, recipients, phoneNumber, ContextUtil.getCurrentUserId());
			count = smsHistoryService.countAll(depId, teamId, sendtime, recipients, phoneNumber, ContextUtil.getCurrentUserId());
		}
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(count).append(",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), "sendTime");
		buff.append(json.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
		
		
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		
		String status = getRequest().getParameter("status");
		
		if(StringUtils.isNotEmpty(status) && status.equals(SmsMobile.STATUS_NOT_SENDED.toString())){
			if(null != ids){
				for(String id:ids){
					smsMobileService.remove(new Long(id));
				}
			}
		}else{
			if(ids!=null){
				for(String id:ids){
					smsHistoryService.remove(new Long(id));
				}
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
		SmsHistory smsHistory=smsHistoryService.get(smsId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(smsHistory));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		smsHistoryService.save(smsHistory);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
