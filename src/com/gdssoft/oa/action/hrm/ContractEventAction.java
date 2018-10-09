package com.gdssoft.oa.action.hrm;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.hrm.ContractEvent;
import com.gdssoft.oa.model.hrm.UserContract;
import com.gdssoft.oa.service.hrm.ContractEventService;
import com.gdssoft.oa.service.hrm.UserContractService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;



import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class ContractEventAction extends BaseAction{
	@Resource
	private ContractEventService contractEventService;
	@Resource
	private UserContractService userContractService;
	private ContractEvent contractEvent;
	
	private Long eventId;

	public Long getEventId() {
		return eventId;
	}

	public void setEventId(Long eventId) {
		this.eventId = eventId;
	}

	public ContractEvent getContractEvent() {
		return contractEvent;
	}

	public void setContractEvent(ContractEvent contractEvent) {
		this.contractEvent = contractEvent;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<ContractEvent> list= contractEventService.getAll(filter);
		
     	Type type=new TypeToken<List<ContractEvent>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		Gson gson = new Gson();
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
				contractEventService.remove(new Long(id));
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
		ContractEvent contractEvent=contractEventService.get(eventId);
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(contractEvent));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(contractEvent.getEventId()==null){
			contractEvent.setCreateTime(new Date());
			contractEvent.setCreator(ContextUtil.getCurrentUser().getFullname());
			contractEventService.save(contractEvent);
		}else{
			contractEvent.setCreateTime(new Date());
			contractEvent.setCreator(ContextUtil.getCurrentUser().getFullname());
			contractEventService.save(contractEvent);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
