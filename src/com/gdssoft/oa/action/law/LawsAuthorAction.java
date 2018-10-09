package com.gdssoft.oa.action.law;

import java.util.List;
import javax.annotation.Resource;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.law.Laws;
import com.gdssoft.oa.model.law.LawsAuthor;
import com.gdssoft.oa.service.law.LawsAuthorService;
import com.gdssoft.oa.service.law.LawsService;
import com.google.gson.Gson;

public class LawsAuthorAction extends BaseAction {
	@Resource
	private LawsAuthorService lawsAuthorService;
	// model类
	private LawsAuthor lawsAuthor;
	
	@Resource
	private LawsService lawsService;
	
	private Long lawsAuthorId;

/*	public LawsService getLawsService() {
		return lawsService;
	}

	public void setLawsService(LawsService lawsService) {
		this.lawsService = lawsService;
	}*/

/*	public LawsAuthorService getLawsAuthorService() {
		return lawsAuthorService;
	}

	public void setLawsAuthorService(LawsAuthorService lawsAuthorService) {
		this.lawsAuthorService = lawsAuthorService;
	}*/

	public LawsAuthor getLawsAuthor() {
		return lawsAuthor;
	}

	public void setLawsAuthor(LawsAuthor lawsAuthor) {
		this.lawsAuthor = lawsAuthor;
	}
	
	public Long getLawsAuthorId() {
		return lawsAuthorId;
	}

	public void setLawsAuthorId(Long lawsAuthorId) {
		this.lawsAuthorId = lawsAuthorId;
	}

	// 类型和名称
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		String lawsAuthorId = getRequest().getParameter("lawsAuthorId");
		if (lawsAuthorId != null && !"".equals(lawsAuthorId)) {
			filter.addFilter("Q_authorId_L_EQ", lawsAuthorId);
		}
		List<LawsAuthor> list = lawsAuthorService.getAll(filter);
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (LawsAuthor lawsAuthor : list) {
			sb.append("['").append(lawsAuthor.getAuthorId()).append("','")
					.append(lawsAuthor.getAuthorName()).append("']");
			sb.append(",");
		}
		sb.deleteCharAt(sb.length() - 1);// 删除最后一个","字符
		sb.append("]");
		this.setJsonString(sb.toString());
		return SUCCESS;
	}

	// 左边的树类型
	public String root() {
		List<LawsAuthor> list = lawsAuthorService.getAll();
		StringBuffer sb = new StringBuffer(
				"[{id:'0',text:'颁布单位分类',leaf:false,expanded:true,children:[");
		for (LawsAuthor lawsAuthor : list) {
			sb.append("{id:'").append(lawsAuthor.getAuthorId())
					.append("',text:'").append(lawsAuthor.getAuthorName())
					.append("',leaf:true},");
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
		lawsAuthorService.save(lawsAuthor);
		this.setJsonString("{success:true}");
		return SUCCESS;
	}

	// 删除操作
	public String remove() {
		String authorId = getRequest().getParameter("authorId");
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_lawsAuthor.authorId_L_EQ", authorId);
		List<Laws> list = lawsService.getAll(filter);
		if(list.size()>0){
    		this.setJsonString("{success:false,message:'该单位下还有法律，请将法律转移后再删除单位!'}");
    		return SUCCESS;
    	}
		lawsAuthorService.remove(Long.parseLong(authorId));
		this.setJsonString("{success:true}");
		return SUCCESS;
	}

	// 获得详细类别
	public String get() {
		String authorId = getRequest().getParameter("authorId");
	    lawsAuthor = lawsAuthorService.get(Long.parseLong(authorId));
		Gson gson = new Gson();
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(lawsAuthor));
		sb.append("}");
		this.setJsonString(sb.toString());
		return SUCCESS;
	}

}
