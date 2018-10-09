package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.OdCommonComments;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.OdCommonCommentsService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class OdCommonCommentsAction extends BaseAction{
	@Resource
	private OdCommonCommentsService odCommonCommentsService;
	private OdCommonComments odCommonComments;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public OdCommonComments getOdCommonComments() {
		return odCommonComments;
	}

	public void setOdCommonComments(OdCommonComments odCommonComments) {
		this.odCommonComments = odCommonComments;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addSorted("updateDate", "Desc");
		List<OdCommonComments> list= odCommonCommentsService.getAll(filter);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
//		Gson gson=new Gson();
//		buff.append(gson.toJson(list, type));
//		buff.append("}");
		
		JSONSerializer serializer=new JSONSerializer();
        serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
        "createDate");
        
        serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
        "updateDate");
//        serializer.transform(new DateTransformer("hh:mm"),
//        "onDutyTime");
//        serializer.transform(new DateTransformer("hh:mm"),
//        "offDutyTime");
        buff.append(serializer.exclude(new String[] {"class"}).serialize(list));
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
				odCommonCommentsService.remove(new Long(id));
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
		OdCommonComments odCommonComments=odCommonCommentsService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
//		sb.append(gson.toJson(odCommonComments));
//		sb.append("}");
//		setJsonString(sb.toString());
		
		JSONSerializer serializer=new JSONSerializer();
//      serializer.transform(new DateTransformer("yyyy-MM-dd"),
//      "dayTime");
//      serializer.transform(new DateTransformer("hh:mm"),
//      "onDutyTime");
//      serializer.transform(new DateTransformer("hh:mm"),
//      "offDutyTime");
		sb.append(serializer.exclude(new String[] { "class" }).serialize(odCommonComments));
		sb.append("}");
		
		jsonString=sb.toString();
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		AppUser currentUser = ContextUtil.getCurrentUser();
		String userAccount=currentUser.getUsername();
		Date date =new Date();
		int type=odCommonComments.getCommentType();
		if(type==1){
			odCommonComments.setAppUser(null);
		}
		if(odCommonComments.getId()==null){
			odCommonComments.setCreateBy(userAccount);
			odCommonComments.setCreateDate(date);
			odCommonComments.setUpdateBy(userAccount);
			odCommonComments.setUpdateDate(date);
			odCommonCommentsService.save(odCommonComments);
		}else{
			OdCommonComments orgOdCommonComments=odCommonCommentsService.get(odCommonComments.getId());
			try{
				BeanUtil.copyNotNullProperties(orgOdCommonComments, odCommonComments);
				orgOdCommonComments.setUpdateBy(userAccount);
				orgOdCommonComments.setUpdateDate(date);
				odCommonCommentsService.save(orgOdCommonComments);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	/**
	 * @description 加载常用批示语[编号Id,标题title]
	 */
	public String getCc() {
		List<OdCommonComments> list = odCommonCommentsService.getAll();
		StringBuffer bf = new StringBuffer("[");
		for (OdCommonComments oCC : list) {
			bf.append("['").append(oCC.getId()).append("','").append(
					oCC.getCommentTitle()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
	
	public String getCommentsForSelector(){
		String commentTitle = getRequest().getParameter("commentTitle");
		String userId = getRequest().getParameter("userId");
		String commentType = getRequest().getParameter("commentType");
		if(StringUtils.isBlank(userId)){
			AppUser currentUser = ContextUtil.getCurrentUser();
			userId = currentUser.getUserId().toString();
		}
		PagingBean pb = getInitPagingBean();

		List<OdCommonComments> list = odCommonCommentsService.getCommentsForSelector(new Long(userId),commentType, commentTitle, pb);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		       .append(pb.getTotalItems()).append(",result:");
		JSONSerializer serializer=new JSONSerializer();
		buff.append(serializer.exclude(new String[] {"class"}).serialize(list));
		buff.append("}");
			
		jsonString=buff.toString();
		return SUCCESS;
	}
	
	public String mobileGetCommentsForSelector(){
		String commentTitle = getRequest().getParameter("commentTitle");
		String userId = getRequest().getParameter("userId");
		String commentType = getRequest().getParameter("commentType");
		PagingBean pb = getInitPagingBean();

		List<OdCommonComments> list = odCommonCommentsService.getCommentsForSelector(new Long(userId),commentType, commentTitle, pb);
		StringBuffer buff = new StringBuffer("{\"success\":true,\"totalCounts\":")
		       .append(pb.getTotalItems()).append(",\"result\":[");
		for(OdCommonComments odCommonComments:list){			
			buff.append("{");
			buff.append("\"commentDesc\":\""+odCommonComments.getCommentDesc()+"\",");
			buff.append("\"commentTitle\":\""+odCommonComments.getCommentTitle()+"\",");
			buff.append("\"id\":\""+odCommonComments.getId()+"\",");
			buff.append("\"commentType\":\""+odCommonComments.getCommentType()+"\"");		
			buff.append("},");
		}
		buff.deleteCharAt(buff.lastIndexOf(","));
		//JSONSerializer serializer=new JSONSerializer();
		//buff.append(serializer.exclude(new String[] {"\"class\""}).serialize(list));
		buff.append("]}");
			
		jsonString=buff.toString();
		return SUCCESS;
	}
	
	public String comQuick() {
		QueryFilter filter=new QueryFilter(getRequest());
		//filter.addFilter("Q_ref1_S_EQ", "3");
		filter.addSorted("id", "asc");
		List<OdCommonComments> list=odCommonCommentsService.getAll(filter);
		StringBuffer buff=new StringBuffer();
		buff.append("[");
		for(int i = 0;i<list.size();i++){
			OdCommonComments objs= list.get(i);
			buff.append("[\""+objs.getId() + "\",\""+objs.getCommentTitle()+"\"]");
			if(i<list.size()-1)buff.append(",");
		}
		buff.append("]");
		jsonString = buff.toString();
		return SUCCESS;
	}
}
