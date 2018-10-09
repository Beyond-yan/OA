package com.gdssoft.oa.action.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


import com.gdssoft.oa.model.jw.JwArchives;
import com.gdssoft.oa.service.jw.JwArchivesService;
/**
 * 
 * @author 
 *
 */
public class JwArchivesAction extends BaseAction{
	@Resource
	private JwArchivesService jwArchivesService;
	private JwArchives jwArchives;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public JwArchives getJwArchives() {
		return jwArchives;
	}

	public void setJwArchives(JwArchives jwArchives) {
		this.jwArchives = jwArchives;
	}

	/**
	 * 显示列表
	 */
	public String list(){
//		String subject=getRequest().getParameter("Q_subject_S_LK");//文件标题
//		String depName=getRequest().getParameter("Q_sourcedepartment_S_LK");//所属部门
//		String startDate=getRequest().getParameter("startdate");
//		String burden=getRequest().getParameter("Q_burden_S_LK");//责任者
//		String endDate=getRequest().getParameter("endDate");//时间
//		String docnum=getRequest().getParameter("Q_docnum_S_LK");//文号
//		String doctype =getRequest().getParameter("Q_doctype_S_LK");//收发类型
//		int start = Integer.parseInt(getRequest().getParameter("start"));
//		int limit = Integer.parseInt(getRequest().getParameter("limit"));
//		List<JwArchives> list= jwArchivesService.getJwArchives(ContextUtil.getCurrentUserId(), subject, depName, startDate, endDate, start, limit, docnum, doctype,burden);
//		Type type=new TypeToken<List<JwArchives>>(){}.getType();
//		int totalCounts = 0;
//		totalCounts=jwArchivesService.count(ContextUtil.getCurrentUserId(), subject, depName, startDate, endDate, docnum, doctype,burden);
//		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
//		.append(totalCounts).append(",result:");
//		Gson gson=new Gson();
//		buff.append(gson.toJson(list, type));
//		buff.append("}");
		QueryFilter filter=new QueryFilter(getRequest());
		List<JwArchives> list= jwArchivesService.getAll(filter);
		
		Type type=new TypeToken<List<JwArchives>>(){}.getType();
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
				jwArchivesService.remove(new Long(id));
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
		JwArchives jwArchives=jwArchivesService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(jwArchives));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(jwArchives.getId()==null){
			jwArchivesService.save(jwArchives);
		}else{
			JwArchives orgJwArchives=jwArchivesService.get(jwArchives.getId());
			try{
				BeanUtil.copyNotNullProperties(orgJwArchives, jwArchives);
				jwArchivesService.save(orgJwArchives);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
