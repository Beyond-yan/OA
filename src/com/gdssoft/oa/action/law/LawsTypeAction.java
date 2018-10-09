package com.gdssoft.oa.action.law;

import java.util.List;
import javax.annotation.Resource;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.law.Laws;
import com.gdssoft.oa.model.law.LawsType;
import com.gdssoft.oa.service.law.LawsService;
import com.gdssoft.oa.service.law.LawsTypeService;
import com.google.gson.Gson;

import flexjson.JSONSerializer;

public class LawsTypeAction extends BaseAction {
	@Resource
	private LawsTypeService lawsTypeService;
	// model类
	private LawsType lawsType;
	// 定义typeId
	
	@Resource
    private LawsService lawsService;
	
	private Long lawsTypeId;
	//private Long typeId;

	/*public Long getTypeId() {
		return typeId;
	}

	public void setTypeId(Long typeId) {
		this.typeId = typeId;
	}*/

	
	public Long getLawsTypeId() {
		return lawsTypeId;
	}

/*	public LawsService getLawsService() {
		return lawsService;
	}

	public void setLawsService(LawsService lawsService) {
		this.lawsService = lawsService;
	}*/

	public void setLawsTypeId(Long lawsTypeId) {
		this.lawsTypeId = lawsTypeId;
	}
/*	public LawsTypeService getLawsTypeService() {
		return lawsTypeService;
	}

	public void setLawsTypeService(LawsTypeService lawsTypeService) {
		this.lawsTypeService = lawsTypeService;
	}*/

	public LawsType getLawsType() {
		return lawsType;
	}

	public void setLawsType(LawsType lawsType) {
		this.lawsType = lawsType;
	}
	// 类型和名称
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		String lawsTypeId = getRequest().getParameter("lawsTypeId");
		if (lawsTypeId != null && !"".equals(lawsTypeId)) {
			filter.addFilter("Q_typeId_L_EQ", lawsTypeId);
		}
		List<LawsType> list = lawsTypeService.getAll(filter);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (LawsType lawsType : list) {
			sb.append("['").append(lawsType.getTypeId()).append("','")
					.append(lawsType.getTypeName()).append("']");
			sb.append(",");
		}
		sb.deleteCharAt(sb.length() - 1);// 删除最后一个","字符
		sb.append("]");
		this.setJsonString(sb.toString());
		return SUCCESS;
	}

	// 左边的树类型
	public String root() {
		List<LawsType> list = lawsTypeService.getAll();
		StringBuffer sb = new StringBuffer(
				"[{id:'0',text:'法律分类',leaf:false,expanded:true,children:[");
		for (LawsType lawsType : list) {
			sb.append("{id:'").append(lawsType.getTypeId()).append("',text:'")
					.append(lawsType.getTypeName()).append("',leaf:true},");
		}
		if (!list.isEmpty()) {
			sb.deleteCharAt(sb.length() - 1);
		}
		sb.append("]}]");
		this.jsonString = sb.toString();
		return SUCCESS;
	}

	// 保存操作
	public String save() {
		lawsTypeService.save(lawsType);
		this.setJsonString("{success:true}");
		return SUCCESS;
	}

	// 删除操作
	public String remove() {
		String typeId = getRequest().getParameter("typeId");
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_lawsType.typeId_L_EQ", typeId);
		List<Laws> list = lawsService.getAll(filter);
		if(list.size()>0){
    		this.setJsonString("{success:false,message:'该类型下还有法律，请将法律转移后再删除类型!'}");
    		return SUCCESS;
    	}
		lawsTypeService.remove(Long.parseLong(typeId));
		this.setJsonString("{success:true}");
		return SUCCESS;
		// }

	}

	// 获得详细类别
	public String get() {
		String typeId = getRequest().getParameter("typeId");
		lawsType = lawsTypeService.get(Long.parseLong(typeId));
		/*StringBuffer sb = new StringBuffer("[");
		sb.append("[\"" + lawsType.getTypeId() + "\",\""
					+ lawsType.getTypeName() + "\"]");
		sb.append("]");*/
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer=new JSONSerializer();
		sb.append(serializer.exclude(new String[] { "class" }).serialize(lawsType));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}



}
