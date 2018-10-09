package com.gdssoft.oa.action.law;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;

import sun.awt.image.ShortBandedRaster;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.law.Laws;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.law.LawsService;
import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class LawsAction extends BaseAction {
	@Resource
	private LawsService lawsService;
	private Laws laws;
	private Long id;
	//private LawsType lawsType;
	//private LawsAuthor lawsAuthor;
	private Long typeId;
	private Long authorId;

	

	/*public LawsAuthor getLawsAuthor() {
		return lawsAuthor;
	}

	public void setLawsAuthor(LawsAuthor lawsAuthor) {
		this.lawsAuthor = lawsAuthor;
	}

	public LawsType getLawsType() {
		return lawsType;
	}

	public void setLawsType(LawsType lawsType) {
		this.lawsType = lawsType;
	}*/

	public Long getAuthorId() {
		return authorId;
	}

	public void setAuthorId(Long authorId) {
		this.authorId = authorId;
	}

	public Long getTypeId() {
		return typeId;
	}

	public void setTypeId(Long typeId) {
		this.typeId = typeId;
	}

	public Laws getLaws() {
		return laws;
	}

	public void setLaws(Laws laws) {
		this.laws = laws;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LawsService getLawsService() {
		return lawsService;
	}

	public void setLawsService(LawsService lawsService) {
		this.lawsService = lawsService;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		String typeId = getRequest().getParameter("typeId");
		String authorId = getRequest().getParameter("authorId");
		if (typeId != null && !"".equals(typeId)) {
			filter.addFilter("Q_lawsType.typeId_L_EQ", typeId);
		}
		if (authorId != null && !"".equals(authorId)) {
			filter.addFilter("Q_lawsAuthor.authorId_L_EQ", authorId);
		}
		
		
		List<Laws> list = lawsService.getAll(filter);
		// Type type=new TypeToken<List<Product>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");


		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createtime", "updatetime", "publishDate", "implementDate" });
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		boolean res = true;
		AppUser currentUser = ContextUtil.getCurrentUser();
		Date now = new Date();
		if(laws.getId()==null){
			laws.setStatus(new Long("2"));
			laws.setCreateTime(now);
			laws.setUpdateTime(now);
			laws.setCreateUser(currentUser.getUsername());
			laws.setUpdateUser(currentUser.getUsername());
			System.out.println("----"+laws.getStatus()+"-----");
			lawsService.save(laws);
		}else{
			Laws orglaws=lawsService.get(laws.getId());
			try{
				BeanUtil.copyNotNullProperties(orglaws, laws);
				laws.setUpdateTime(now);
				laws.setUpdateUser(currentUser.getUsername());
				lawsService.save(orglaws);
			}catch(Exception ex){
				res = false;
				logger.error(ex.getMessage());
			}
		}
		
		setJsonString("{success:"+res+"}");
		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {

		laws = lawsService.get(id);
		// Gson gson=new Gson();
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createtime", "updatetime", "publishDate", "implementDate" });
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(json.exclude(new String[] { "class" }).serialize(laws));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				lawsService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

}
