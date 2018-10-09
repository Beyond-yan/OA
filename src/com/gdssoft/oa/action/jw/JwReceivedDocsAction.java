package com.gdssoft.oa.action.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.jw.JwReceivedDocs;
import com.gdssoft.oa.service.jw.JwReceivedDocsService;
/**
 * 
 * @author 
 *
 */
public class JwReceivedDocsAction extends BaseAction{
	@Resource
	private JwReceivedDocsService jwReceivedDocsService;
	private JwReceivedDocs jwReceivedDocs;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public JwReceivedDocs getJwReceivedDocs() {
		return jwReceivedDocs;
	}

	public void setJwReceivedDocs(JwReceivedDocs jwReceivedDocs) {
		this.jwReceivedDocs = jwReceivedDocs;
	}

	/**
	 * 显示列表
	 */
	public String list(){
//		String subject=getRequest().getParameter("Q_subject_S_LK");
//		String depName=getRequest().getParameter("Q_sourcedepartment_S_LK");
//		String startDate=getRequest().getParameter("startDate");
//		String endDate=getRequest().getParameter("endDate");
//		String archiveNo=getRequest().getParameter("Q_docnum_S_LK");
//		String depSignNo =getRequest().getParameter("depSignNo");
//		int start = Integer.parseInt(getRequest().getParameter("start"));
//		int limit = Integer.parseInt(getRequest().getParameter("limit"));
//		QueryFilter filter=new QueryFilter(getRequest());
//		List<JwReceivedDocs> list= jwReceivedDocsService.getJwArchives(ContextUtil.getCurrentUserId(), subject, depName, startDate, endDate, start, limit, archiveNo, depSignNo);
//		int totalCounts = 0;
//		totalCounts=jwReceivedDocsService.count(ContextUtil.getCurrentUserId(), subject, depName, startDate, endDate, archiveNo, depSignNo);
//		Type type=new TypeToken<List<JwReceivedDocs>>(){}.getType();
//		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
//		.append(totalCounts).append(",result:");
//		
//		Gson gson=new Gson();
//		buff.append(gson.toJson(list, type));
//		buff.append("}");
//		
//		jsonString=buff.toString();
//		
//		return SUCCESS;
		QueryFilter filter=new QueryFilter(getRequest());
		List<JwReceivedDocs> list= jwReceivedDocsService.getAll(filter);
		
		Type type=new TypeToken<List<JwReceivedDocs>>(){}.getType();
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
				jwReceivedDocsService.remove(new Long(id));
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
		JwReceivedDocs jwReceivedDocs=jwReceivedDocsService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(jwReceivedDocs));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(jwReceivedDocs.getId()==null){
			jwReceivedDocsService.save(jwReceivedDocs);
		}else{
			JwReceivedDocs orgJwReceivedDocs=jwReceivedDocsService.get(jwReceivedDocs.getId());
			try{
				BeanUtil.copyNotNullProperties(orgJwReceivedDocs, jwReceivedDocs);
				jwReceivedDocsService.save(orgJwReceivedDocs);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
