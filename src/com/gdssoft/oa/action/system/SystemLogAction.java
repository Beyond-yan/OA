package com.gdssoft.oa.action.system;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.system.SystemLog;
import com.gdssoft.oa.service.system.SystemLogService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author 
 *
 */
public class SystemLogAction extends BaseAction{
	@Resource
	private SystemLogService systemLogService;
	private SystemLog systemLog;
	
	private Long logId;

	public Long getLogId() {
		return logId;
	}

	public void setLogId(Long logId) {
		this.logId = logId;
	}

	public SystemLog getSystemLog() {
		return systemLog;
	}

	public void setSystemLog(SystemLog systemLog) {
		this.systemLog = systemLog;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<SystemLog> list= systemLogService.getAll(filter);
		
		Type type=new TypeToken<List<SystemLog>>(){}.getType();
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
				systemLogService.remove(new Long(id));
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
		SystemLog systemLog=systemLogService.get(logId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(systemLog));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		systemLogService.save(systemLog);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
