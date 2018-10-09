package com.gdssoft.oa.action.admin;
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

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;


import com.gdssoft.oa.model.admin.CarCardHistory;
import com.gdssoft.oa.service.admin.CarCardHistoryService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class CarCardHistoryAction extends BaseAction{
	@Resource
	private CarCardHistoryService carCardHistoryService;
	private CarCardHistory carCardHistory;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public void setCardHistoryService(CarCardHistoryService carCardHistoryService)
	{
		this.carCardHistoryService = carCardHistoryService;
	}
	
	public CarCardHistoryService getCarCardHistoryService()
	{
		return carCardHistoryService;
	}
	
	public CarCardHistory getCarCardHistory() {
		return carCardHistory;
	}

	public void setCarCardHistory(CarCardHistory carCardHistory) {
		this.carCardHistory = carCardHistory;
	}


	

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<CarCardHistory> list= carCardHistoryService.getAll(filter);
		
		Type type=new TypeToken<List<CarCardHistory>>(){}.getType();
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
				carCardHistoryService.remove(new Long(id));
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
		CarCardHistory carCardHistory=carCardHistoryService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(carCardHistory));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(carCardHistory.getId()==null){
			carCardHistoryService.save(carCardHistory);
		}else{
			CarCardHistory orgCarCardHistory=carCardHistoryService.get(carCardHistory.getId());
			try{
				BeanUtil.copyNotNullProperties(orgCarCardHistory, carCardHistory);
				carCardHistoryService.save(orgCarCardHistory);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	

	public String find()
	{
		String qType = getRequest().getParameter("type");
		String qConsumeType = getRequest().getParameter("usetype");
		String qCode = getRequest().getParameter("code");
		
		String qSort = getRequest().getParameter("sort");
		String qDir = getRequest().getParameter("dir");
		String orderBy = "";
		
		if(qSort==null)
		{
		  orderBy = " USE_DATE DESC ";
		}
		else
		{
			orderBy = qSort +" "+ qDir;
		}
		
		QueryFilter filter=new QueryFilter(getRequest());
		
	
	    PagingBean pb = 	filter.getPagingBean();
		
	    qType=qType==null?"1":qType;
	    qConsumeType=qConsumeType==null?"0":qConsumeType;
	    qCode=qCode==null?"":qCode;
	    
	    // 全部
		if(qConsumeType.equals("0"))
		{
			qConsumeType = " 1 or his.USE_TYPE = 2 ";
		}
		
		logger.debug("qType: " + qType);
		logger.debug("qConsumeType: "+qConsumeType);
		logger.debug("qCode: " +qCode);
		
		List list = carCardHistoryService.findByCon(qType,qCode,qConsumeType,orderBy,pb);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(pb.getTotalItems()).append(
				",result:");

		JSONSerializer serializer = new JSONSerializer();
		//serializer.transform(new DateTransformer("yyyy-MM-dd"), "his.USE_DATE");
		buff.append(serializer.exclude(new String[]{"class" }).serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		logger.debug("GGG DEBUG: " + jsonString);
		return SUCCESS;
	}
}
