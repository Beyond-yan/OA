package com.gdssoft.oa.action.snconfig;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.snconfig.FileSnConfigHistory;
import com.gdssoft.oa.service.snconfig.FileSnConfigHistoryService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
/**
 * 
 * @author 
 *
 */
public class FileSnConfigHistoryAction extends BaseAction{
	@Resource
	private FileSnConfigHistoryService fileSnConfigHistoryService;
	private FileSnConfigHistory fileSnConfigHistory;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public FileSnConfigHistory getFileSnConfigHistory() {
		return fileSnConfigHistory;
	}

	public void setFileSnConfigHistory(FileSnConfigHistory fileSnConfigHistory) {
		this.fileSnConfigHistory = fileSnConfigHistory;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<FileSnConfigHistory> list= fileSnConfigHistoryService.getAll(filter);
		
		Type type=new TypeToken<List<FileSnConfigHistory>>(){}.getType();
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
				fileSnConfigHistoryService.remove(new Long(id));
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
		FileSnConfigHistory fileSnConfigHistory=fileSnConfigHistoryService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(fileSnConfigHistory));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(fileSnConfigHistory.getId()==null){
			fileSnConfigHistoryService.save(fileSnConfigHistory);
		}else{
			FileSnConfigHistory orgFileSnConfigHistory= fileSnConfigHistoryService.get(fileSnConfigHistory.getId());
			try{
				BeanUtil.copyNotNullProperties(orgFileSnConfigHistory, fileSnConfigHistory);
				fileSnConfigHistoryService.save(orgFileSnConfigHistory);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
