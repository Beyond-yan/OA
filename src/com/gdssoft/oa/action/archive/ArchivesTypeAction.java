package com.gdssoft.oa.action.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.archive.ArchivesType;
import com.gdssoft.oa.service.archive.ArchivesTypeService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;


/**
 * 
 * @author 
 *
 */
public class ArchivesTypeAction extends BaseAction{
	@Resource
	private ArchivesTypeService archivesTypeService;
	private ArchivesType archivesType;
	
	private Long typeId;

	public Long getTypeId() {
		return typeId;
	}

	public void setTypeId(Long typeId) {
		this.typeId = typeId;
	}

	public ArchivesType getArchivesType() {
		return archivesType;
	}

	public void setArchivesType(ArchivesType archivesType) {
		this.archivesType = archivesType;
	}
	
	/**
	 * 
	 * @return
	 */
	public String combo(){
		StringBuffer sb=new StringBuffer();
		
		List<ArchivesType> dutySectionList=archivesTypeService.getAll();
		sb.append("[");
		for(ArchivesType dutySection:dutySectionList){
			sb.append("['").append(dutySection.getTypeId()).append("','").append(dutySection.getTypeName()).append("'],");
		}
		if(dutySectionList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 生成Json格式的树
	 * @return
	 */
	public String tree(){
		
		List<ArchivesType> typeList=archivesTypeService.getAll();
		
		StringBuffer sb=new StringBuffer();
		sb.append("[{id:'0',text:'所有公文分类',expanded:true,children:[");
		for(ArchivesType type:typeList){
			sb.append("{id:'"+type.getTypeId()).append("',text:'"+type.getTypeName()).append("',leaf:true,expanded:true},");
		}
		if(typeList.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		sb.append("]}]");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<ArchivesType> list= archivesTypeService.getAll(filter);
		
		Type type=new TypeToken<List<ArchivesType>>(){}.getType();
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
				archivesTypeService.remove(new Long(id));
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
		ArchivesType archivesType=archivesTypeService.get(typeId);
		
		Gson gson=new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(archivesType));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		archivesTypeService.save(archivesType);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
