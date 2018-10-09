package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.CommonUnits;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.CommonUnitsService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class CommonUnitsAction extends BaseAction{
	@Resource
	private CommonUnitsService commonUnitsService;
	private CommonUnits commonUnits;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public CommonUnits getCommonUnits() {
		return commonUnits;
	}

	public void setCommonUnits(CommonUnits commonUnits) {
		this.commonUnits = commonUnits;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addSorted("updateDate", "Desc");
		List<CommonUnits> list= commonUnitsService.getAll(filter);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer serializer=new JSONSerializer();
        serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
        "createDate");
        
        serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
        "updateDate");
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
				commonUnitsService.remove(new Long(id));
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
		CommonUnits commonUnits=commonUnitsService.get(id);
		
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer=new JSONSerializer();
		sb.append(serializer.exclude(new String[] { "class" }).serialize(commonUnits));
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
		if(commonUnits.getId()==null){
			commonUnits.setCreateBy(userAccount);
			commonUnits.setCreateDate(date);
			commonUnits.setUpdateBy(userAccount);
			commonUnits.setUpdateDate(date);
			commonUnitsService.save(commonUnits);
		}else{
			CommonUnits orgCommonUnits=commonUnitsService.get(commonUnits.getId());
			try{
				BeanUtil.copyNotNullProperties(orgCommonUnits, commonUnits);
				orgCommonUnits.setUpdateBy(userAccount);
				orgCommonUnits.setUpdateDate(date);
				commonUnitsService.save(orgCommonUnits);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	/**
	 * @description 加载常用单位[编号Id,标题title]
	 */
	public String getCu() {
		List<CommonUnits> list = commonUnitsService.getAll();
		StringBuffer bf = new StringBuffer("[");
		for (CommonUnits cu : list) {
			bf.append("['").append(cu.getId()).append("','").append(
					cu.getUnitName()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}
	
	public String getUnitsForSelector(){
		String unitName = getRequest().getParameter("unitName");
		String unitType = getRequest().getParameter("unitType");
		PagingBean pb = getInitPagingBean();

		List<CommonUnits> list = commonUnitsService.getUnitsForSelector( unitName,Short.valueOf(unitType), pb);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		       .append(pb.getTotalItems()).append(",result:");
		JSONSerializer serializer=new JSONSerializer();
		buff.append(serializer.exclude(new String[] {"class"}).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		return SUCCESS;
	}
}
