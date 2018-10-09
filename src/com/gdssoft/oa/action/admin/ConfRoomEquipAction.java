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


import com.gdssoft.oa.model.admin.ConfRoomEquip;
import com.gdssoft.oa.service.admin.ConfRoomEquipService;
/**
 * 
 * @author 
 *
 */
public class ConfRoomEquipAction extends BaseAction{
	@Resource
	private ConfRoomEquipService confRoomEquipService;
	private ConfRoomEquip confRoomEquip;
	
	private Long id;

	
	private Long roon_id;//cxt
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	
	
	
	public Long getRoon_id() {
		return roon_id;
	}

	public void setRoon_id(Long roonId) {
		roon_id = roonId;
	}

	public ConfRoomEquip getConfRoomEquip() {
		return confRoomEquip;
	}

	public void setConfRoomEquip(ConfRoomEquip confRoomEquip) {
		this.confRoomEquip = confRoomEquip;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		//getRequest()
		QueryFilter filter=new QueryFilter(getRequest());
		System.out.println("====================getRequest()=================="+getRequest().getParameter("Q_roomid_L_EQ"));
//		filter.setFilterName("Q_roomId_L_EQ");
		List<ConfRoomEquip> list= confRoomEquipService.getAll(filter);
		
		Type type=new TypeToken<List<ConfRoomEquip>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		System.out.println("=================jsonString========================="+jsonString);
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
				confRoomEquipService.remove(new Long(id));
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
		ConfRoomEquip confRoomEquip=confRoomEquipService.get(id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(confRoomEquip));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(confRoomEquip.getId()==null){
			confRoomEquipService.save(confRoomEquip);
		}else{
			ConfRoomEquip orgConfRoomEquip=confRoomEquipService.get(confRoomEquip.getId());
			try{
				BeanUtil.copyNotNullProperties(orgConfRoomEquip, confRoomEquip);
				confRoomEquipService.save(orgConfRoomEquip);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	
	public String getPart(){
		ConfRoomEquip confRoomEquip=confRoomEquipService.get(roon_id);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(confRoomEquip));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	
	
}
