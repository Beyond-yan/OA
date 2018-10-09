package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.archive.ArchRecType;
import com.gdssoft.oa.service.archive.ArchRecTypeService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;



import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class ArchRecTypeAction extends BaseAction{
	@Resource
	private ArchRecTypeService archRecTypeService;
	private ArchRecType archRecType;
	
	private Long recTypeId;

	public Long getRecTypeId() {
		return recTypeId;
	}

	public void setRecTypeId(Long recTypeId) {
		this.recTypeId = recTypeId;
	}

	public ArchRecType getArchRecType() {
		return archRecType;
	}

	public void setArchRecType(ArchRecType archRecType) {
		this.archRecType = archRecType;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<ArchRecType> list= archRecTypeService.getAll(filter);
		
//		Type type=new TypeToken<List<ArchRecType>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
//		Gson gson=new GsonBuilder().create();
//		buff.append(gson.toJson(list, type));
		JSONSerializer serializer=new JSONSerializer();
		buff.append(serializer.exclude(new String[]{"class"}).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 下拉选择
	 */
	public String combo(){
		QueryFilter filter=new QueryFilter(getRequest());
		List<ArchRecType> list= archRecTypeService.getAll(filter);
		StringBuffer sb=new StringBuffer("[");
		for(ArchRecType type:list){
			sb.append("['").append(type.getRecTypeId()).append("','").append(type.getTypeName()).append("'],");
		}
		if(list.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
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
				archRecTypeService.remove(new Long(id));
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
		ArchRecType archRecType=archRecTypeService.get(recTypeId);
		
//		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
//		sb.append(gson.toJson(archRecType));
		JSONSerializer serializer=new JSONSerializer();
		sb.append(serializer.exclude(new String[]{"class","department.class"}).serialize(archRecType));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		archRecTypeService.save(archRecType);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
