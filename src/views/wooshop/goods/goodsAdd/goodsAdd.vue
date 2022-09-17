<template>
  <div>
    <!--工具栏-->
    <el-form ref="goodsListForm" :model="goodsListForm" :rules="rules" size="small" label-width="100px">
      <!--  基本信息    -->
      <h4>基本信息</h4>
      <el-row>
        <el-col :span="14">
          <el-form-item label="商品分类" prop="categoryId">
            <el-cascader style="width: 82%;"
                         :options="caregoryData"
                         :props="defaultParams"
                         v-model="goodsListForm.categoryId"
                         @change="changeClassification"
                         clearable></el-cascader>
            <div>
              <el-link type="primary" @click="toLinkClassification(1)" target="_blank">去新增</el-link>
              <el-link type="primary" @click="getClassification(1)" target="_blank">刷新</el-link>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="计量单位" prop="goodsUnit">
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="goodsListForm.goodsUnit"
              :fetch-suggestions="unitDataListQuerySearch"
              placeholder="请输入内容"
              @select="unitDataListhandleSelect">
              <i
                class="el-icon-edit el-input__icon"
                slot="suffix"
                @click="unitDataListhandleIconClick">
              </i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
                <!--                    <span class="addr">{{ item.address }}</span>-->
              </template>

            </el-autocomplete>
            <span style="color: #C0C0C0;margin-left: 2px;">建议使用一个字符</span>
            <div>
              <el-link type="primary" @click="toLinkUnit" target="_blank">去新增</el-link>
              <!--                <el-link type="primary" @click="getClassification('1')" target="_blank">刷新</el-link>-->
            </div>
          </el-form-item>

        </el-col>
      </el-row>
      <!--        </div>-->
      <!--  商品信息   -->
      <!--        <h4>商品信息</h4>-->
      <!--  seo   -->
      <h4>seo</h4>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品名称" prop="goodsName">
            <el-input clearable v-model="goodsListForm.goodsName" style="width: 100%;"
                      placeholder="请输入内容,12-18个字符内!"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="seo关键字" prop="metaKeywords">
            <el-input clearable v-model="goodsListForm.metaKeywords" style="width: 95%;"
                      placeholder="请输入内容,12-18个字符内!"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品介绍" prop="goodsInfo">
            <el-input clearable v-model="goodsListForm.goodsInfo" style="width: 100%;" :rows="5" type="textarea"
                      maxlength="50"
                      show-word-limit
                      placeholder="请输入内容,12-18个字符内!"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="商品主图" prop="coverImage">
            <div class="upLoadPicBoxGoodsAdd" @click="imagesFile(1,'goodsListForm.coverImage')">
              <div v-if="goodsListForm.coverImage" class="pictrue"><img :src="goodsListForm.coverImage"></div>
              <div v-else class="upLoad">
                <i class="el-icon-camera cameraIconfont"/>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="轮播图" prop="slideshow">
            <div class="slideshowImage">
              <div @dragstart="handleDragStart($event, item)"
                   @dragover.prevent="handleDragOver($event, item)"
                   @dragenter="handleDragEnter($event, item)"
                   @dragend="handleDragEnd($event, item)"
                   v-for="(item,index) in goodsListForm.slideshow"
                   :key="index"
                   class="pictrueimg"
                   draggable="true"
              >
                <img :src="item" style="width: 100px;height: 100px">
                <i class="el-icon-error btndel" @click="slideshowDel(index)"/>
              </div>
              <div class="upLoadPicBoxGoodsAdd" v-if="goodsListForm.slideshow.length < 5"
                   @click="imagesFile(5,'goodsListForm.slideshow')">
                <div class="upLoad">
                  <i class="el-icon-camera cameraIconfont"/>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>


      <!--  物流/其他   -->
      <h4>物流/其他</h4>
      <el-row>
        <el-col :span="10">
          <el-form-item label="运费:" prop="goodsTransfeeCharge" style="width: 100%;">
            <el-radio v-model="goodsListForm.goodsTransfeeCharge" :label=1>卖家承担运费</el-radio>
            <el-radio v-model="goodsListForm.goodsTransfeeCharge" :label=0>买家承担运费</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="14" v-show="goodsListForm.goodsTransfeeCharge===0">
          <el-form-item label="运费模板" prop="templateId" style="width: 100%;">
            <el-select v-model="goodsListForm.templateId" clearable placeholder="请选择">
              <el-option
                v-for="item in templateDataList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <div>
              <el-link type="primary" @click="toLinkClassification(3)" target="_blank">去新增</el-link>
              <el-link type="primary" @click="getTemplateData(3)" target="_blank">刷新</el-link>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!--  兑换许可   -->
      <h4>兑换许可</h4>
      <el-row>
        <el-col :span="8">
          <el-form-item label="积分抵扣">
            <el-switch
              v-model="goodsListForm.isIntegral"
              active-text="开启"
              inactive-text="关闭"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">开启后按照商城设定的比例抵扣</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购买返积分">
            <el-input-number :min="0.00" :step="1" v-model="goodsListForm.giveIntegral"></el-input-number>
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">开启后用户购买此商品将获得积分</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="虚拟销量">
            <el-input-number :min="0" :step="1" v-model="goodsListForm.fictitiousVolume"></el-input-number>
            <div>
              <span style="color: #C0C0C0;margin-left: 2px;">用户端展示的销量 = 初始销量 + 实际销量</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>


      <!--  规格/库存   -->
      <h4>规格/库存</h4>
      <el-form-item label="商品编码" prop="goodsCode">
        <el-input clearable v-model="goodsListForm.goodsCode" style="width: 45%;" maxlength="30"
                  placeholder="请输入内容,18位以内的编码字符!"/>
      </el-form-item>
      <el-form-item label="分销方式:" prop="distributionStart">
        <el-radio-group v-model="goodsListForm.distributionStart">
          <el-radio-button :label="1">独立分销</el-radio-button>
          <el-radio-button :label="0">默认设置</el-radio-button>
        </el-radio-group>
        <span style="color: #C0C0C0;margin-left: 2px;">独立分销:按照每个单独suk设置分销佣金,默认设置:按照商城配置分销佣金方式。</span>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品规格:" prop="specType">
            <el-radio-group v-model="goodsListForm.specType">
              <el-radio-button :label="0">单规格</el-radio-button>
              <el-radio-button :label="1">多规格</el-radio-button>
            </el-radio-group>

          </el-form-item>
        </el-col>
        <el-col :span="14" v-show="goodsListForm.specType===1">
          <el-form-item label="使用模板">
            <el-select v-model="specificationDataValue" clearable placeholder="请选择服务承诺" style="width: 20%;">
              <el-option
                v-for="(item,index) in specificationDataList"
                :key="index"
                :label="item.name"
                :value="item.params">
              </el-option>
            </el-select>
            <el-button size="small" type="primary" @click="clickGetspecification">确定</el-button>
            <!--              <span style="color: #C0C0C0;margin-left: 2px;">最少一个,可进行多选</span>-->
            <!--              <div>-->
            <el-link type="primary" @click="toLinkClassification(5)" target="_blank">去新增</el-link>
            <el-link type="primary" @click="getSpecificationData(5)" target="_blank">刷新</el-link>
            <!--              </div>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-for="(item,index) in sprcificationParlams" v-show="goodsListForm.specType===1">
        <el-col :span="8">
          <el-form-item label="规格:" style="margin-left: 30px">
            <el-input size="mini" v-model="item.k" label="规格名称:" style="width: 100px;" clear></el-input>
            <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="kdel(item.k,index)">删除
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="值:">
            <el-tag v-for="(v, vindex) in item.vList"
                    :key="vindex"
                    closable
                    size="medium"
                    :disable-transitions="false"
                    @close="delV(item.vList,vindex)"
            >
              {{ v }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="item.inputShow"
              v-model="item.value"
              size="small"
              @keyup.enter.native="vInput(item.value,index)"
              @blur="vInput(item.value,index)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" type="success" @click="addValue(item,index)">添加值
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="goodsListForm.specType===1">
        <el-col :span="24">
          <el-form-item>
            <el-button @click="clickAddguige" type="success" size="small" style="margin-left: 7px" plain>新增规格
            </el-button>
            <span v-show="goodsListForm.specType===1" style="color: #C0C0C0;margin-left: 2px;">最多添加3个商品规格组，生成的SKU数量不能超出50个</span>
          </el-form-item>
        </el-col>
      </el-row>

      <!--   单规格     -->
      <el-row v-if="goodsListForm.specType===0">
        <el-col :span="24">
          <el-form-item label="规格详情：">
            <el-table style="width: 100%" border :data="goodsSuk">
              <el-table-column label="规格" align="center" width="60">
                <template slot-scope="scope">
                  {{ scope.row.suk }}
                </template>

              </el-table-column>
              <el-table-column label="图片" align="center" width="60">
                <template slot-scope="scope">
                  <div class="upLoadPicBoxSuk" @click="imagesFile(1,'goodsSuk[0].sukImg')">
                    <div v-if="scope.row.sukImg" class="pictrueSuk"><img :src="scope.row.sukImg"></div>
                    <div v-else class="upLoadSuk">
                      <i class="el-icon-camera cameraIconfont"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="库存" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.quantity" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="销售价格" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.price" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="成本" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.cost" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="原价" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.originalPrice" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.weight" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="体积（m³）" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.volume" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="货号" align="center" width="155">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.goodsCode" size="mini" placeholder="请输入货架号/编码"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="一级分销佣金(元)" align="center" width="155"
                               v-if="goodsListForm.distributionStart===1">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.distribution" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="二级分销佣金(元)" align="center" width="155"
                               v-if="goodsListForm.distributionStart===1">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.distributionSecond" :step="1" :min="0"
                                   size="mini"></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <!--  多规格批量设置      -->
      <el-row v-if="goodsListForm.specType===1&&goodsSpeificationListData.length>1">
        <el-col :span="24">
          <el-form-item label="批量设置：">
            <el-table style="width: 100%" max-height="350" border :data="batchParams">
              <el-table-column label="图片" align="center" width="60">
                <template slot-scope="scope">
                  <div class="upLoadPicBoxSuk" @click="imagesFile(1,'batchParams[0].sukImg')">
                    <div v-if="scope.row.sukImg" class="pictrueSuk"><img :src="scope.row.sukImg"></div>
                    <div v-else class="upLoadSuk">
                      <i class="el-icon-camera cameraIconfont"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="库存" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.quantity" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="销售价格" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.price" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="成本" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.cost" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="原价" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.originalPrice" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.weight" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="体积（m³）" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.volume" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="货号" align="center" width="155">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.goodsCode" size="mini" placeholder="请输入货架号/编码"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="一级分销佣金(元)" align="center" width="155"
                               v-if="goodsListForm.distributionStart===1">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.distribution" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="二级分销佣金(元)" align="center" width="155"
                               v-if="goodsListForm.distributionStart===1">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.distributionSecond" :step="1" :min="0"
                                   size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="60">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="setBatchParams(batchParams, goodsSpeificationListData)"
                    type="text"
                    size="small">
                    批量设置
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <!--   多规格     -->
      <el-row v-if="goodsListForm.specType===1">
        <el-col :span="24">
          <el-form-item label="规格详情：">
            <el-table style="width: 100%" max-height="350" border :data="goodsSpeificationListData">
              <template v-if="goodsSpeificationTitle">
                <el-table-column v-for="(item,index) in goodsSpeificationTitle" :key="index" align="center" fixed
                                 :label="goodsSpeificationTatle[index].title" width="60">
                  <template slot-scope="scope">
                    <span class="priceBox" v-text="scope.row[index]"/>
                  </template>
                </el-table-column>
              </template>
              <el-table-column label="图片" align="center" width="60">
                <template slot-scope="scope">
                  <div class="upLoadPicBoxSuk"
                       @click="imagesFile(1,'goodsSpeificationListData['+scope.$index+'].sukImg')">
                    <div v-if="scope.row.sukImg" class="pictrueSuk"><img :src="scope.row.sukImg"></div>
                    <div v-else class="upLoadSuk">
                      <i class="el-icon-camera cameraIconfont"/>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="库存" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.quantity" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="销售价格" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.price" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="成本" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.cost" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="原价" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.originalPrice" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.weight" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="体积（m³）" align="center" width="155">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.volume" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="货号" align="center" width="155">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.goodsCode" size="mini" placeholder="请输入货架号/编码"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="一级分销佣金(元)" align="center" width="155"
                               v-if="goodsListForm.distributionStart===1">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.distribution" :step="1" :min="0" size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="二级分销佣金(元)" align="center" width="155"
                               v-if="goodsListForm.distributionStart===1">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.distributionSecond" :step="1" :min="0"
                                   size="mini"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="60">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="delSprcification(scope.$index, goodsSpeificationListData)"
                    type="text"
                    size="small">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="库存总量:">
            <el-input style="width: 10%;"
                      placeholder="请输入内容"
                      v-model="goodsListForm.quantity"
                      :disabled="true">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="服务承诺" prop="promiseId">
        <el-select v-model="goodsListForm.promiseId" clearable multiple placeholder="请选择服务承诺" style="width: 40%;">
          <el-option
            v-for="item in promiseDataList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span style="color: #C0C0C0;margin-left: 2px;">最少一个,可进行多选</span>
        <div>
          <el-link type="primary" @click="toLinkClassification(4)" target="_blank">去新增</el-link>
          <el-link type="primary" @click="getPromiseData(4)" target="_blank">刷新</el-link>
        </div>
      </el-form-item>


      <!--  商品详情   -->
      <h4>商品详情描述</h4>
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品描述:">
            <TEditor ref="editor" v-model="goodsListForm.intro"/>
          </el-form-item>
        </el-col>
      </el-row>

      <!--  更多设置   -->
      <h4>更多设置</h4>
      <el-row>
        <el-form-item label="参与活动:">
          <el-col :span="4">
            <el-checkbox :true-label="1" v-model="goodsListForm.isBest">精品推荐</el-checkbox>
          </el-col>
          <el-col :span="4">
            <el-checkbox :true-label="1" v-model="goodsListForm.isHot">热卖商品</el-checkbox>
          </el-col>
          <el-col :span="4">
            <el-checkbox :true-label="1" v-model="goodsListForm.isNew">新品首发</el-checkbox>
          </el-col>
          <el-col :span="4">
            <el-checkbox :true-label="1" v-model="goodsListForm.isBenefit">促销单品</el-checkbox>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="商品发布:">
            <el-radio-group v-model="goodsListForm.isStart">
              <el-radio-button :label="0">放入仓库</el-radio-button>
              <el-radio-button :label="1">立刻发布</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品推荐:">
            <el-radio-group v-model="goodsListForm.goodStart">
              <el-radio-button :label="0">不推荐</el-radio-button>
              <el-radio-button :label="1">推荐</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排序:">
            <!--            <el-input v-model="form.sort" style="width: 370px;" />-->
            <el-input-number v-model="goodsListForm.sort" :min="1" :max="999" label="排序"></el-input-number>
            <span style="color: #C0C0C0;margin-left: 2px;">数字越小越靠前</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-form-item label="恢复商品:" >
              <el-radio-group v-model="goodsListForm.isDel">
                <el-radio-button :label="0">不推荐</el-radio-button>
                <el-radio-button :label="1">推荐</el-radio-button>
              </el-radio-group>
            </el-form-item>-->
      <el-form-item label="恢复商品:" v-if="goodsIsDel===1">
        <el-switch
          v-model="goodsListForm.isDel"
          inactive-text="保持原样"
          active-text="恢复"
          :active-value="0"
          :inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        <div>
          <span style="color: #C0C0C0;margin-left: 2px;">将回收站的商品恢复出来</span>
        </div>
      </el-form-item>

      <el-button  v-permission="['admin','wooshopStoreGoods:addSubmit']"  size="medium "
                  type="success" style="margin-bottom: 50px;margin-top: 30px;margin-left: 60px"
                 @click="goodsSubmit">提交
      </el-button>
    </el-form>

    <FilesModal ref="tupianziyuan" @getFileImage="getFileImage"></FilesModal>
  </div>
</template>

<script>
import {getimgcategory, queryGet as queryGetCategory} from '@/api/wooshopConfigCategory'
import {getAll} from '@/api/wooshopStoreProductUnit'
import FilesModal from '../../../filesModal/FilesModal'
import CRUD, {presenter, header, form, crud} from '@crud/crud'
import crudWooshopStoreGoods from '@/api/wooshopStoreGoods'
import {queryGet} from '@/api/wooshopFreightTemplate'
import {queryGetAll} from '@/api/wooshopStoreProductPromise'
import {queryGet as queryGetSpecification} from '@/api/wooshopStoreProductSpecification'
import TEditor from '../../../components/TEditor.vue'
import {query as queryGoods, add as addGoods} from '@/api/wooshopStoreGoods'

const defaultCrudquer = CRUD({
  title: '商品添加页',
  url: 'api/wooshopStoreGoods',
  query: {goodsStartType: 0},
  sort: 'sort,asc'
})
const defaultFormadd = {
  id: null,
  goodsInfo: null,
  goodsName: null,
  coverImage: null,
  metaKeywords: null,
  barCode: null,
  categoryId: null,
  price: null,
  mktprice: null,
  goodsTransfeeCharge: null,
  goodsUnit: null,
  buyCount: null,
  quantity: null,
  isBenefit: null,
  isHot: null,
  isBest: null,
  isNew: null,
  giveIntegral: null,
  isIntegral: null,
  cost: null,
  seckillStart: null,
  bargainStart: null,
  goodStart: null,
  distributionStart: null,
  fictitiousVolume: null,
  viewCount: null,
  codePath: null,
  templateId: null,
  specType: null,
  selfOperated: null,
  isAuth: null,
  authMessage: null,
  underMessage: null,
  commentNum: null,
  grade: null,
  promiseId: null,
  sellerId: null,
  uid: null,
  isDel: null,
  createTime: null,
  updateTime: null,
  sort: null,
  goodsCode: null,
  isStart: null
}
export default {
  name: "goodsAdd",
  // components: { pagination, crudOperation, rrOperation, udOperation, FilesModal },
  components: {FilesModal, TEditor},
  mixins: [presenter(defaultCrudquer), header(), form(defaultFormadd), crud()],
  data() {
    return {
      goodsIsDel: 0,//删除
      goodsListForm: {
        id: null,
        categoryId: [],//分类
        goodsUnit: null,//计量单位
        goodsInfo: null,//商品介绍
        goodsName: null,//商品名称
        coverImage: null,//主图
        metaKeywords: null,//seo关键字
        slideshow: [],//轮播图
        goodsCode: null,//商品编码
        goodsTransfeeCharge: 1, //邮费 1卖家承担运费,0买家承担运费
        templateId: null,//运费模板
        sort: 999,//排序
        isIntegral: 1,//积分兑换
        giveIntegral: 0,//购买获得商城积分
        fictitiousVolume: 0,//虚拟销量
        promiseId: [],//服务承诺
        distributionStart: 0,//分销佣金方式
        specType: 0,//规格类型 1多
        quantity: 0,//库存总量
        intro: null,//详情
        isStart: 1,//商品状态 0放入仓库
        goodStart: 1,//商品推荐 0否
        isBest: 1,//精品商品 默认是0
        isHot: 1,//热卖商品 默认是0
        isNew: 1,//新品商品 默认是0
        specTypeListData: [],//多规格数据
        activityType: 0,//0普通商品
        sprcificationParlams: [],//多规格参数
        specTypeListDataOrig: [],//多规格原始数据
        isDel: 0,//删除
        mktprice: null,//原价
        price: null,//销售价格
      },
      //单规格
      goodsSuk: [{
        id: null,
        specificationValue: null,
        goodsId: null,
        suk: '默认',
        quantity: 0,
        sales: null,
        price: null,
        sukImg: null,
        cost: null,
        goodsCode: null,
        originalPrice: null,
        weight: null,
        volume: null,
        distribution: null,
        distributionSecond: null,
        activityType: 0,
        restrictions: null,
        restrictionsShow: null,
      }],
      //批量设置
      batchParams: [{
        quantity: 0,
        sales: 0,
        price: 0,
        sukImg: '',
        cost: 0,
        goodsCode: '',
        originalPrice: 0,
        weight: 0,
        volume: 0,
        distribution: 0,
        distributionSecond: 0
      }],
      sprcificationParlams: [{k: '', value: null, vList: [], inputShow: true, inputShowk: true}], //规格数据
      rules: {
        distributionStart: [
          {required: true, message: '分销佣金方式不能为空', trigger: 'blur'}
        ],
        specType: [
          {required: true, message: '规格方式方式不能为空', trigger: 'blur'}
        ],
        goodsCode: [
          {required: true, message: '商品编码不能为空', trigger: 'blur'}
        ],
        promiseId: [
          {required: true, message: '服务承诺不能为空', trigger: 'blur'}
        ],
        templateId: [
          {required: true, message: '买家承担运费,运费模板不能为空', trigger: 'blur'}
        ], slideshow: [
          {required: true, message: '商品轮播图不能为空', trigger: 'blur'}
        ], coverImage: [
          {required: true, message: '商品主图不能为空', trigger: 'blur'}
        ], goodsInfo: [
          {required: true, message: '商品介绍不能为空', trigger: 'blur'}
        ], metaKeywords: [
          {required: true, message: '商品seo关键字不能为空', trigger: 'blur'}
        ], goodsName: [
          {required: true, message: '商品名称不能为空', trigger: 'blur'}
        ],
        goodsUnit: [
          {required: true, message: '商品名称不能为空', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '商品分类id不能为空', trigger: 'blur'}
        ],
        specType: [
          {required: true, message: '规格类型 0单规格 1多规格不能为空', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '商品排序不能为空', trigger: 'blur'}
        ]
      },
      //商品类别
      caregoryData: [],
      defaultParams: {
        multiple: true,
        label: 'name',
        value: 'id',
        children: 'childClass',
        expandTrigger: 'hover'
      },
      //计量单位
      unitDataList: [],
      draggableImage: null, //拖拽图片
      templateDataList: [], //快递模板
      promiseDataList: [], //服务承诺
      specificationDataList: [], //商品规格模板数据
      specificationDataValue: null,//规格模板
      vListInfo: {},
      goodsSpeificationListData: [], // 多规格
      goodsSpeificationTatle: {},
      goodsSpeificationTitle: {},
      formThead: [],
    }
  }, created(val) {
    console.log('进来新增', this.$refs.pinkageAdd)
    if (this.$route.params.add !== ":add") {
      console.log('进来获取参数', this.$route.params.add)

      this.initialize()//初始化
      console.log('获取商品信息', this.goodsListForm)
    }
    this.getClassification()//商品分类数据
    this.getUnitData()//计量单位数据
    this.getTemplateData()//快递模板数据
    this.getPromiseData()//服务承诺数据
    this.getSpecificationData()//商品规格模板数据
  },
  watch: {
    'goodsSuk': {
      handler: function (val) {
        if (this.goodsListForm.specType === 0) {
          this.goodsListForm.quantity = this.goodsSuk[0].quantity
        }
        console.log('单规格wcthc触发库存', this.goodsListForm.quantity)
      },
      immediate: false,
      deep: true
    },
    'goodsSpeificationListData': {
      handler: function (val) {
        if (this.goodsListForm.specType === 1 && this.goodsSpeificationListData.length > 0) {
          var totals = 0
          this.goodsSpeificationListData.forEach((item, index) => {
            totals += item.quantity
          })
          this.goodsListForm.quantity = totals
        }
        console.log('wcthc触发库存', this.goodsListForm.quantity)
      },
      immediate: false,
      deep: true
    },
    //商品规格数据变动触发 多规格
    'sprcificationParlams': {
      handler: function (values) {
        if (this.goodsListForm.specType === 1 && !this.goodsListForm.sprcificationParlams.length > 0) this.watChSprcification(values)
        else this.goodsListForm.sprcificationParlams = []
        console.log('wcthc触发', this.sprcificationParlams, values)
      },
      immediate: false,
      deep: true
    }
  },
  methods: {
    initialize() {
      //编辑初始化
      console.log('编辑初始化', this.$route.params.add)
      if (this.$route.params.add !== "0") {
        queryGoods({id: this.$route.params.add, goodsStartType: 0, sort: 'sort,asc'}).then(async res => {
          console.log('获取商品信息', res.content[0])
          let resData = res.content[0]
          this.goodsListForm = resData
          this.goodsListForm.slideshow = JSON.parse(resData.slideshow)
          this.goodsListForm.promiseId = JSON.parse(resData.promiseId)
          this.goodsListForm.categoryId = JSON.parse(resData.categoryId)
          this.goodsListForm.activityType = 0
          this.goodsIsDel = this.goodsListForm.isDel
          // res.content.categoryId= JSON.parse(res.content.categoryId)
          // res.content.promiseId= JSON.parse(res.content.promiseId)
          this.goodsListForm.specTypeListData.forEach((item, index) => {
            item.specificationValue = JSON.stringify(item.specificationValue)
            // console.log("specTypeListData",item)
          })
          if (this.goodsListForm.specType === 1) {//多规格
            this.sprcificationParlams = JSON.parse(this.goodsListForm.sprcificationParlams)//商品多规格属性参数
            this.goodsSpeificationListData = JSON.parse(this.goodsListForm.specTypeListDataOrig)//规格
            const tatle = {}
            const speificationTitle = {}
            this.sprcificationParlams.forEach((o, i) => {
              tatle['value' + i] = {title: o.k}
              speificationTitle['value' + i] = ''
            })
            this.goodsSpeificationTatle = tatle
            this.goodsSpeificationTitle = speificationTitle
          } else {//单规格

            this.goodsSuk[0] = this.goodsListForm.specTypeListData[0];
            console.log('单规格', this.goodsSuk)
          }

          console.log('打印获取商品信息', this.goodsSpeificationListData)
          console.log('sprcificationParlams', this.sprcificationParlams)
          // this.watChSprcification(this.sprcificationParlams)
        })
      } else {
        /*this.getClassification()//商品分类数据
        this.getUnitData()//计量单位数据
        this.getTemplateData()//快递模板数据
        this.getPromiseData()//服务承诺数据
        this.getSpecificationData()//商品规格模板数据*/
      }

    },
    goodsSubmit() {
      //提交
      if (this.goodsListForm.specType === 1) {//多规格
        console.log('多规格1', this.goodsSpeificationListData)
        console.log('多规格2', this.sprcificationParlams)
        console.log('多规格3', this.goodsSpeificationListData)
        //销售价格 price
        //原价 originalPrice
        //成本价格 cost
        var num = 0
        for (let i = 0; i < this.goodsSpeificationListData.length; i++) {
          if (i === 0) {
            num = this.goodsSpeificationListData[i].price
            this.goodsListForm.mktprice = this.goodsSpeificationListData[i].originalPrice
            this.goodsListForm.price = this.goodsSpeificationListData[i].price
            this.goodsListForm.cost = this.goodsSpeificationListData[i].cost
          } else {
            if (this.goodsSpeificationListData[i].price < num) {
              num = this.goodsSpeificationListData[i].price
              this.goodsListForm.mktprice = this.goodsSpeificationListData[i].originalPrice
              this.goodsListForm.price = this.goodsSpeificationListData[i].price
              this.goodsListForm.cost = this.goodsSpeificationListData[i].cost
            }
          }
        }
        this.goodsListForm.specTypeListData = this.goodsSpeificationListData;
        this.goodsListForm.sprcificationParlams = this.sprcificationParlams;//规格
        this.goodsListForm.specTypeListDataOrig = this.goodsSpeificationListData;
      } else {//单规格
        this.goodsListForm.specTypeListData = this.goodsSuk[0];
        this.goodsListForm.specTypeListDataOrig = this.goodsSuk;
        this.goodsListForm.quantity = this.goodsSuk[0].quantity;
        this.goodsSuk.forEach(item => {
          this.goodsListForm.mktprice = item.originalPrice
          this.goodsListForm.price = item.price
          this.goodsListForm.cost = item.cost
        })
      }
      if (this.goodsListForm.isDel === 1) {
        this.goodsListForm.isStart = 0
      }
      addGoods(this.goodsListForm).then(res => {
        console.log('提交成功', res)
      })
      this.$router.push({path: '/product/goods/' + ':add'})
      console.log('提交', this.goodsListForm)
    },
    setBatchParams(batchParams, goodsSpeificationListData) {
      //批量设置
      goodsSpeificationListData.forEach((item, index) => {
        item.quantity = batchParams[0].quantity
        item.sales = batchParams[0].sales
        item.price = batchParams[0].price
        item.sukImg = batchParams[0].sukImg
        item.cost = batchParams[0].cost
        item.goodsCode = batchParams[0].goodsCode
        item.originalPrice = batchParams[0].originalPrice
        item.weight = batchParams[0].weight
        item.volume = batchParams[0].volume
        item.distribution = batchParams[0].distribution
        item.distributionSecond = batchParams[0].distributionSecond
      })
    },
    delSprcification(index, item) {
      //多规格删除
      console.log('删除', index, item)
      item.splice(index, 1)
    },
    watChSprcification(values) {
      const tatle = {}
      const speificationTitle = {}
      this.sprcificationParlams.forEach((o, i) => {
        tatle['value' + i] = {title: o.k}
        speificationTitle['value' + i] = ''
      })
      // console.log('this.attrFormat(val)val', val)
      this.goodsSpeificationListData = this.attrFormat(values)
      // console.log('watCh()_ManyAttrValue', this.goodsSpeificationListData)
      this.goodsSpeificationListData.forEach((item, index) => {
        const specification_key = Object.values(item.specification_value).sort().join('/')
        if (this.vListInfo[specification_key]) this.goodsSpeificationListData[index] = this.vListInfo[specification_key]
      })
      this.vListInfo = {}
      this.goodsSpeificationListData.forEach((item) => {
        this.vListInfo[Object.values(item.specification_value).sort().join('/')] = item
      })
      this.goodsSpeificationTatle = tatle
      this.goodsSpeificationTitle = speificationTitle
      // this.formThead = Object.assign({}, this.formThead, tmp)
      console.log('this.goodsSpeificationListData', this.goodsSpeificationListData)
      console.log('goodsSpeificationTatle', tatle)
      console.log('goodsSpeificationTitle', speificationTitle)
      console.log('sprcificationParlams', this.sprcificationParlams)
      // console.log('formThead', this.formThead)
    },
    attrFormat(arr) {
      let data = []
      const consequences = []
      return format(arr)

      function format(arr) {
        if (arr.length > 1) {
          arr.forEach((v, i) => {
            if (i === 0) data = arr[i]['vList']
            const tmp = []
            data.forEach(function (vv) {
              arr[i + 1] && arr[i + 1]['vList'] && arr[i + 1]['vList'].forEach(g => {
                const rep2 = (i !== 0 ? '' : arr[i]['k'] + '_') + vv + '$&' + arr[i + 1]['k'] + '_' + g
                tmp.push(rep2)//添加
                if (i === (arr.length - 2)) {
                  const rep4 = {
                    id: null,
                    goodsId: null,
                    suk: null,
                    quantity: null,
                    sales: null,
                    price: null,
                    sukImg: null,
                    cost: null,
                    goodsCode: null,
                    originalPrice: null,
                    weight: null,
                    volume: null,
                    distribution: null,
                    distributionSecond: null,
                    activityType: 0,
                    restrictions: null,
                    restrictionsShow: null,
                    isDel: null,
                    createTime: null,
                    updateTime: null
                  }
                  rep2.split('$&').forEach((h, k) => {
                    const rep3 = h.split('_')
                    if (!rep4['specification_value']) rep4['specification_value'] = {}
                    rep4['specification_value'][rep3[0]] = rep3.length > 1 ? rep3[1] : ''
                  })
                  Object.values(rep4.specification_value).forEach((v, i) => {
                    rep4['value' + i] = v
                    rep4.suk === null ? rep4.suk = v : rep4.suk = rep4.suk + ',' + v
                  })
                  consequences.push(rep4)
                }
              })
            })
            data = tmp.length ? tmp : []
          })
        } else {
          const dataArr = []
          arr.forEach((v, k) => {
            v['vList'].forEach((vv, kk) => {
              dataArr[kk] = v['k'] + '_' + vv
              consequences[kk] = {
                id: null,
                goodsId: null,
                suk: null,
                quantity: null,
                sales: null,
                price: null,
                sukImg: null,
                cost: null,
                goodsCode: null,
                originalPrice: null,
                weight: null,
                volume: null,
                distribution: null,
                distributionSecond: null,
                activityType: 0,
                restrictions: null,
                restrictionsShow: null,
                specification_value: {[v['k']]: vv}
              }
              Object.values(consequences[kk].specification_value).forEach((v, i) => {
                consequences[kk]['value' + i] = v
                consequences[kk].suk === null ? consequences[kk].suk = v : consequences[kk].suk = consequences[kk].suk + ',' + v
              })
            })
          })
          data.push(dataArr.join('$&'))
        }
        return consequences
      }
    },
    clickGetspecification() {
      //点击确定使用商品规格模板
      console.log('点击商品规格模板', this.specificationDataValue)
      this.sprcificationParlams = this.specificationDataValue
    },
    kdel(item, index) {
      //删除规格
      console.log('点击删除', item, index)
      this.sprcificationParlams.splice(index, 1)
    },
    addValue(item, index) {
      console.log('添加值', item, index)
      this.sprcificationParlams[index].inputShow = true;
      // this.vInpautShow=true;

    },
    vInput(item, index) {
      console.log('输入框失去焦点')
      //值 输入框 失去焦点
      if (this.sprcificationParlams[index].value != null) {
        this.sprcificationParlams[index].vList.push(item)
        this.sprcificationParlams[index].value = null;
        this.sprcificationParlams[index].inputShow = false;
        // this.valueList=null
        // this.vInpautShow=false
      }
    },
    delV(item, vindex) {
      //删除规格值
      console.log('删除值前item', item)
      // console.log('删除值前', this.sprcificationParlams[index].vList)
      // this.sprcificationParlams[index].vList.splice(vindex, 1);
      item.splice(vindex, 1);
      // console.log('删除值后', this.sprcificationParlams[index].vList)
    },
    clickAddguige() {
      //添加规格
      console.log('添加规格')
      this.sprcificationParlams.push(Object.assign({}, {
        k: '',
        value: null,
        vList: [],
        inputShow: true,
        inputShowk: true
      }))
    },
    getSpecificationData(index) {
      //获取商品规格模板数据
      queryGetSpecification({isStart: 1, page: 0, size: 1000, sort: 'sort,asc'}).then(res => {
        console.log('商品规格模板数据', res.content)
        res.content.forEach((item, index) => {
          item.params = JSON.parse(item.params)
        })
        this.specificationDataList = res.content
        if (index === 5) {
          this.$message({
            message: '刷新商品规格数据成功！',
            type: 'success'
          })
        }
        console.log('商品规格模板数据', res.content)
      })
    },
    getPromiseData(index) {
      //获取服务承诺模板数据
      queryGetAll({isStart: 1, page: 0, size: 1000, sort: 'sort,asc'}).then(res => {
        console.log('获取服务承诺模板', res)
        this.promiseDataList = res.content
        if (index === 4) {
          this.$message({
            message: '刷新服务承诺数据成功！',
            type: 'success'
          })
        }
      })
    },
    getTemplateData(index) {
      //获取快递模板数据
      queryGet({sort: 'sort,asc', isStart: 1, page: 0, size: 1000}).then(res => {
        console.log('获取快递模板', res)
        this.templateDataList = res.content
        if (index === 3) {
          this.$message({
            message: '刷新快递模板成功！',
            type: 'success'
          })
        }
      })
    },
    getFileImage(img) {
      //父类接收图片 goodsListForm.coverImage
      console.log('父组件获取图片', img)
      if (img.parentName === 'goodsListForm.coverImage') {
        this.goodsListForm.coverImage = img.image[0].path;
      } else if (img.parentName === 'goodsListForm.slideshow') {
        //轮播图
        img.image.forEach((item, index) => {
          if (this.goodsListForm.slideshow.length === 5) return
          this.goodsListForm.slideshow.push(item.path)
        })
      } else if (img.parentName === 'goodsSuk[0].sukImg') {
        //单规格
        this.goodsSuk[0].sukImg = img.image[0].path
      } else if (img.parentName === 'batchParams[0].sukImg') {
        //规格批量设置
        this.batchParams[0].sukImg = img.image[0].path
      } else if (img.parentName.indexOf('goodsSpeificationListData') !== -1) {
        //多规格设置
        const str = img.parentName
        var num = str.slice(str.indexOf('[') + 1, str.indexOf(']'))
        console.log('多规格设置图片', num, str)
        this.goodsSpeificationListData[num].sukImg = img.image[0].path
      }
      console.log('获取的图片', this.goodsListForm.slideshow)
    },
    imagesFile(num, name) {
      // 获取图片
      console.log('获取图片', name)
      const _this = this.$refs.tupianziyuan
      _this.num = num
      if (name === 'goodsListForm.slideshow') {
        var num = 5 - this.goodsListForm.slideshow.length
        if (num > 0) {
          _this.num = num
        } else {
          return
        }
      }
      _this.parentName = name
      _this.outerVisible = true
    },
    toLinkUnit() {
      //新增 计量单位
      this.$router.push({path: '/product/unit'})
    },
    toLinkClassification(index) {
      //1:去新增 商品类别 3:去新增快递模板 4:去新增服务承诺 5:去新增商品规格
      if (index === 1) {
        this.$router.push({path: '/product/classification/'})
      } else if (index === 3) {
        this.$router.push({path: '/wooshopconfig/wooshop/FreightTemplate/' + '0'})
      } else if (index === 4) {
        this.$router.push({path: '/product/promise/'})
      } else if (index === 5) {
        this.$router.push({path: '/product/specification/'})
      }

    },
    changeClassification() {
      //商品类别选中数据
      // console.log('选中数据', this.goodsListForm.categoryId)
    },
    getClassification(num) {
      //获取类别数据初始化
      const classficationData = {type: 2, sort: 'sort,asc', enabled: 1, page: 0, size: 1000}
      queryGetCategory(classficationData).then(res => {
        console.log('商品分类', res)
        this.caregoryData = this.getTreeData(res.content)
        this.caregoryData.forEach((item, index) => {
          item.childClass === undefined ? this.caregoryData.splice(index, 1) : ''
          // console.log('商品分类forEach',item,index)
        })
        if (num === 1) {
          this.$message({
            message: '刷新商品类别成功！',
            type: 'success'
          })
        }
      })

    },
    getTreeData(data) {
      // 递归方法
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].childClass.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].childClass = undefined
          // data.splice(i, 1)
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].childClass)
        }
      }
      return data;
    }, unitDataListhandleSelect(item) {
      console.log('unitDataListhandleSelect', item);
      this.goodsListForm.goodsUnit = item.name;
    },
    unitDataListhandleIconClick(ev) {
      console.log('unitDataListhandleIconClick', ev);
    },
    unitDataListQuerySearch(queryString, cb) {
      //计量单位 输入建议匹配
      // console.log('计量单位输入建议', queryString, cb)
      var restaurants = this.unitDataList;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    getUnitData() {
      //get请求获取数据（计量单位）
      getAll({isStart: 1, page: 0, size: 1000, sort: 'sort,asc'}).then(res => {
        console.log('请求获取数据（计量单位）', res)
        this.unitDataList = res.content
      })
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    slideshowDel(index) {
      //删除
      this.goodsListForm.slideshow.splice(index, 1)
    },
    handleDragStart(e, item) {
      // 移动图片
      this.dragging = item;
    },
    handleDragEnd(e, item) {
      //处理拖动结束
      this.dragging = null
    },
    handleDragOver(e) {
      //处理拖拽
      e.dataTransfer.dropEffect = 'move'
    },
    handleDragEnter(e, item) {
      //拖拽进入
      e.dataTransfer.effectAllowed = 'move'
      if (item === this.dragging) {
        return
      }
      const newItems = [...this.goodsListForm.slideshow]
      const src = newItems.indexOf(this.dragging)
      const dst = newItems.indexOf(item)
      newItems.splice(dst, 0, ...newItems.splice(src, 1))
      this.goodsListForm.slideshow = newItems;
    }
  }
}
</script>

<style scoped>
h4 {
  margin-bottom: 10px;
  padding: 0 10px;
  border: 1px solid #ddd;
  background-color: #f8f8f8;
  font-weight: bold;
  color: #333;
  font-size: 14px;
  line-height: 26px;
  text-align: left;
}

/*选择商品品类*/
.content-goods-publish {
  padding: 15px;
  margin: 0 auto;
  /*text-align: center;*/
  border: 1px solid #ddd;
  background: none repeat 0 0 #fff;
}

.my-autocomplete {

li {
  line-height: normal;
  padding: 7px;

.name {
  text-overflow: ellipsis;
  overflow: hidden;
}

.addr {
  font-size: 12px;
  color: #b4b4b4;
}

.highlighted .addr {
  color: #ddd;
}

}
}
.slideshowImage {
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-lines: multiple;
  -moz-box-lines: multiple;
  -o-box-lines: multiple;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  /* 辅助类 */
}

.pictrueimg {
  width: 100px;
  height: 100px;
  border: 1px dotted rgba(0, 0, 0, 0.1);
  margin-right: 10px;
  position: relative;
  cursor: pointer;

img {
  width: 100%;
  height: 100%;
}

}

.btndel {
  position: absolute;
  z-index: 1;
  width: 20px !important;
  height: 20px !important;
  left: 90px;
  top: -4px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
