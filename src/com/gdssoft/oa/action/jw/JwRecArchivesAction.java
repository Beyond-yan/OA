package com.gdssoft.oa.action.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.jw.JwRecArchives;
import com.gdssoft.oa.service.jw.JwRecArchivesService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
/**
 * 
 * @author 
 *
 */
public class JwRecArchivesAction extends BaseAction{
	@Resource
	private JwRecArchivesService jwRecArchivesService;
	private JwRecArchives jwRecArchives;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public JwRecArchives getJwRecArchives() {
		return jwRecArchives;
	}

	public void setJwRecArchives(JwRecArchives jwRecArchives) {
		this.jwRecArchives = jwRecArchives;
	}

	/**
	 * 显示列表
	 */
	public String list(){
//		String subject=getRequest().getParameter("Q_subject_S_LK");//文件标题
//		String depName=getRequest().getParameter("Q_sourcedepartment_S_LK");//发文单位
//		String startDate=getRequest().getParameter("Q_inbumfday_S_LK");//收文日期
//		String endDate=getRequest().getParameter("Q_bumfday_S_LK");//成文日期
//		String inbumfno=getRequest().getParameter("Q_inbumfno_S_LK");//收文编号
//		String bumfno =getRequest().getParameter("Q_bumfno_S_LK");//来文字号
//		int start = Integer.parseInt(getRequest().getParameter("start"));
//		int limit = Integer.parseInt(getRequest().getParameter("limit"));
//		List<JwRecArchives> list= jwRecArchivesService.getJwArchives(ContextUtil.getCurrentUserId(), subject, depName, startDate, endDate, start, limit, inbumfno, bumfno);
//		int totalCounts = 0;
//		totalCounts=jwRecArchivesService.count(ContextUtil.getCurrentUserId(), subject, depName, startDate, endDate, inbumfno, bumfno);
//		Type type=new TypeToken<List<JwRecArchives>>(){}.getType();
//		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
//		.append(totalCounts).append(",result:");
//		
//		Gson gson=new Gson();
//		buff.append(gson.toJson(list, type));
//		buff.append("}");
		QueryFilter filter = new QueryFilter(getRequest());
	    List<JwRecArchives> list = this.jwRecArchivesService.getAll(filter);
	    
	    Type type=new TypeToken<List<JwRecArchives>>(){}.getType();
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
				jwRecArchivesService.remove(new Long(id));
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
		JwRecArchives jwRecArchives=jwRecArchivesService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(jwRecArchives));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(jwRecArchives.getId()==null){
			jwRecArchivesService.save(jwRecArchives);
		}else{
			JwRecArchives orgJwRecArchives=jwRecArchivesService.get(jwRecArchives.getId());
			try{
				BeanUtil.copyNotNullProperties(orgJwRecArchives, jwRecArchives);
				jwRecArchivesService.save(orgJwRecArchives);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
