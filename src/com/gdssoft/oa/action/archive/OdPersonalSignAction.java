package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.OdPersonalSign;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.OdPersonalSignService;
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
public class OdPersonalSignAction extends BaseAction{
	@Resource
	private OdPersonalSignService odPersonalSignService;
	private OdPersonalSign odPersonalSign;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public OdPersonalSign getOdPersonalSign() {
		return odPersonalSign;
	}

	public void setOdPersonalSign(OdPersonalSign odPersonalSign) {
		this.odPersonalSign = odPersonalSign;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<OdPersonalSign> list= odPersonalSignService.getAll(filter);
		
		Type type=new TypeToken<List<OdPersonalSign>>(){}.getType();
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
//      serializer.transform(new DateTransformer("yyyy-MM-dd"),
//      "dayTime");
//      serializer.transform(new DateTransformer("hh:mm"),
//      "onDutyTime");
//      serializer.transform(new DateTransformer("hh:mm"),
//      "offDutyTime");
      buff.append(serializer.exclude(new String[] { "class" }).serialize(list));
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
				odPersonalSignService.remove(new Long(id));
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
		OdPersonalSign odPersonalSign=odPersonalSignService.get(id);
		
		//Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
//		sb.append(gson.toJson(odPersonalSign));
//		sb.append("}");
//		setJsonString(sb.toString());
		
		JSONSerializer serializer=new JSONSerializer();
//      serializer.transform(new DateTransformer("yyyy-MM-dd"),
//      "dayTime");
//      serializer.transform(new DateTransformer("hh:mm"),
//      "onDutyTime");
//      serializer.transform(new DateTransformer("hh:mm"),
//      "offDutyTime");
		sb.append(serializer.exclude(new String[] { "class" }).serialize(odPersonalSign));
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
		if(odPersonalSign.getId()==null){
			Long userId=odPersonalSign.getAppUser().getUserId();
			int num=odPersonalSignService.judgeOdPersonalSignNum(userId);
			if(num>0){
				setJsonString("{failure:true,msg:'" + "该用户已经上传个性签名！" + "'}");
				return SUCCESS;
			}
			odPersonalSign.setCreateBy(userAccount);
			odPersonalSign.setCreateDate(date);
			odPersonalSign.setUpdateBy(userAccount);
			odPersonalSign.setUpdateDate(date);
			odPersonalSignService.save(odPersonalSign);
		}else{
			OdPersonalSign orgOdPersonalSign=odPersonalSignService.get(odPersonalSign.getId());
			try{
				BeanUtil.copyNotNullProperties(orgOdPersonalSign, odPersonalSign);
						odPersonalSign.setCreateBy(userAccount);
			odPersonalSign.setCreateDate(date);
			odPersonalSign.setUpdateBy(userAccount);
			odPersonalSign.setUpdateDate(date);
				odPersonalSignService.save(orgOdPersonalSign);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
}
